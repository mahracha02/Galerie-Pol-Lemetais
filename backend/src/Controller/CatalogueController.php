<?php

namespace App\Controller;

use App\Entity\Artiste;
use App\Entity\Catalogue;
use App\Repository\CatalogueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Intervention\Image\ImageManager;

#[Route('/catalogues')]
final class CatalogueController extends AbstractController{

    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private CatalogueRepository $catalogueRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/catalogues/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }
    private function handleImageUpload($imageData): ?string
    {
        if (!$imageData) {
            return null;
        }

        try {
            // Check if the image data is base64
            if (strpos($imageData, 'data:image') === 0) {
                $parts = explode(',', $imageData);
                if (count($parts) !== 2) {
                    throw new \Exception('Invalid base64 image format');
                }
                $imageData = $parts[1];
            }

            // Decode base64 data
            $decodedData = base64_decode($imageData);
            if ($decodedData === false) {
                throw new \Exception('Invalid base64 image data');
            }
            
            // Create image manager instance with GD driver
            $imageManager = ImageManager::withDriver(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $imageManager->read($decodedData);

            // Crop and resize image to a 5:4 aspect ratio
            $image->cover(800, 640);

            // Generate unique filename
            $newFilename = uniqid() . '.jpg';

            // Ensure upload directory exists
            if (!is_dir($this->uploadDir)) {
                if (!mkdir($this->uploadDir, 0777, true)) {
                    throw new \Exception('Failed to create upload directory');
                }
            }

            // Save the resized image as a high-quality JPEG
            $filePath = $this->uploadDir . $newFilename;
            $image->save($filePath, 85, 'jpg');
            
            return $newFilename;
        } catch (\Exception $e) {
            throw new \Exception('Image upload failed: ' . $e->getMessage());
        }
    }

    private function getPhotoUrl($photoPath): string
    {
        if (!$photoPath) {
            return '';
        }
        if (strpos($photoPath, 'http://') === 0 || strpos($photoPath, 'https://') === 0) {
            return $photoPath;
        }
        return $this->getParameter('app.base_url') . 'uploads/catalogues/' . ltrim($photoPath, '/');
    }

    #[Route('/api', name: 'app_artiste_catalogues', methods: ['GET'])]
    public function getCataloguesPublished(Request $request): Response
    {
        $catalogues = $this->catalogueRepository->findBy(['published' => true]);

        $catalogues = array_map(function (Catalogue $catalogue) {
            return [
                'id' => $catalogue->getId(),
                'titre' => $catalogue->getTitre(),
                'image' => $this->getPhotoUrl($catalogue->getImage()),
                'link' => $catalogue->getLink(),
                'published' => $catalogue->isPublished(),
            ];
        }, $catalogues);
        return $this->json($catalogues);
    }

    #[Route('/admin/api', name: 'catalogue_admin_list', methods: ['GET'])]
    public function getAllCatalogues(): Response
    {
        $catalogues = $this->catalogueRepository->findAll();
        $data = array_map(function (Catalogue $catalogue) {
            return [
                'id' => $catalogue->getId(),
                'titre' => $catalogue->getTitre(),
                'image' => $this->getPhotoUrl($catalogue->getImage()),
                'link' => $catalogue->getLink(),
                'published' => $catalogue->isPublished(),
            ];
        }, $catalogues);
        return $this->json($data);
    }

    #[Route('/admin/api/{id}', name: 'catalogue_admin_show', methods: ['GET'])]
    public function getCatalogue(int $id): Response
    {
        $catalogue = $this->catalogueRepository->find($id);
        if (!$catalogue) {
            return $this->json(['error' => 'Catalogue not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json([
            'id' => $catalogue->getId(),
            'titre' => $catalogue->getTitre(),
            'image' => $this->getPhotoUrl($catalogue->getImage()),
            'link' => $catalogue->getLink(),
            'published' => $catalogue->isPublished(),
        ]);
    }

    #[Route('/admin/api', name: 'catalogue_admin_create', methods: ['POST'])]
    public function createCatalogue(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        $catalogue = new Catalogue();
        $catalogue->setTitre($data['titre'] ?? '');
        $catalogue->setLink($data['link'] ?? '');
        $catalogue->setPublished($data['published'] ?? false);
        // Image upload
        if (!empty($data['image'])) {
            try {
                $imagePath = $this->handleImageUpload($data['image']);
                $catalogue->setImage($imagePath);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
        $this->entityManager->persist($catalogue);
        $this->entityManager->flush();
        return $this->json(['id' => $catalogue->getId()], Response::HTTP_CREATED);
    }

    #[Route('/admin/api/{id}', name: 'catalogue_admin_update', methods: ['PUT'])]
    public function updateCatalogue(Request $request, int $id): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        $catalogue = $this->catalogueRepository->find($id);
        if (!$catalogue) {
            return $this->json(['error' => 'Catalogue not found'], Response::HTTP_NOT_FOUND);
        }
        if (array_key_exists('titre', $data)) $catalogue->setTitre($data['titre']);
        if (array_key_exists('link', $data)) $catalogue->setLink($data['link']);
        if (array_key_exists('published', $data)) $catalogue->setPublished($data['published']);
        // Image upload
        if (isset($data['image'])) {
            if (!empty($data['image']) && strpos($data['image'], 'data:image') === 0) {
                // New base64 image uploaded - delete old image first
                $oldImage = $catalogue->getImage();
                if ($oldImage && !empty($oldImage)) {
                    $this->deleteOldImage($oldImage);
                }
                try {
                    $imagePath = $this->handleImageUpload($data['image']);
                    $catalogue->setImage($imagePath);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            } elseif (empty($data['image'])) {
                $catalogue->setImage(null);
            }
        }
        $this->entityManager->persist($catalogue);
        $this->entityManager->flush();
        return $this->json(['id' => $catalogue->getId()], Response::HTTP_OK);
    }

    #[Route('/admin/api/{id}', name: 'catalogue_admin_delete', methods: ['DELETE'])]
    public function deleteCatalogue(int $id): Response
    {
        $catalogue = $this->catalogueRepository->find($id);
        if (!$catalogue) {
            return $this->json(['error' => 'Catalogue not found'], Response::HTTP_NOT_FOUND);
        }
        // Delete image file
        $oldImage = $catalogue->getImage();
        if ($oldImage && !empty($oldImage)) {
            $this->deleteOldImage($oldImage);
        }
        $this->entityManager->remove($catalogue);
        $this->entityManager->flush();
        return $this->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    private function deleteOldImage($oldPhotoPath): void
    {
        if (!$oldPhotoPath || empty($oldPhotoPath)) {
            return;
        }
        $filename = basename($oldPhotoPath);
        $fullPath = $this->uploadDir . $filename;
        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }
}
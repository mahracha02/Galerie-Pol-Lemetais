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

    #[Route('/api', name: 'app_artiste_catalogues', methods: ['GET'])]
    public function getCataloguesPublished(Request $request): Response
    {
        $catalogues = $this->catalogueRepository->findBy(['published' => true]);

        $catalogues = array_map(function (Catalogue $catalogue) {
            return [
                'id' => $catalogue->getId(),
                'titre' => $catalogue->getTitre(),
                'image' => $catalogue->getImage(),
                'link' => $catalogue->getLink(),
                'published' => $catalogue->isPublished(),
            ];
        }, $catalogues);
        return $this->json($catalogues);
    }

    #[Route('/admin/api', name: 'app_artiste_catalogues', methods: ['GET'])]
    public function getCatalogues(Request $request): Response
    {
        $catalogues = $this->catalogueRepository->findAll();

        $catalogues = array_map(function (Catalogue $catalogue) {
            return [
                'id' => $catalogue->getId(),
                'titre' => $catalogue->getTitre(),
                'image' => $catalogue->getImage(),
                'link' => $catalogue->getLink(),
            ];
        }, $catalogues);
        return $this->json($catalogues);
    }
}
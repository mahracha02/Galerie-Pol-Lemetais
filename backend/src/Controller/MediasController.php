<?php 

namespace App\Controller;

use App\Repository\OeuvreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Artiste;
use App\Entity\Evenement;
use App\Entity\Exposition;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Intervention\Image\ImageManager;
use App\Entity\Medias;

#[Route('/medias')]
final class MediasController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private OeuvreRepository $oeuvreRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/medias/';
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

            // Generate a unique filename
            $filename = uniqid() . '.jpg';
            $filePath = $this->uploadDir . $filename;

            // Save the image to the filesystem
            $image->save($filePath);

            return $filename;
        } catch (\Exception $e) {
            throw new \Exception('Error processing image upload: ' . $e->getMessage());
        }
    }
    
    #[Route('/admin/api', name: 'api_medias_admin', methods: ['GET'])]
    public function getAllMedias(EntityManagerInterface $em): Response
    {
        $medias = $em->getRepository(Medias::class)->findAll();
        $data = array_map(function (Medias $media) {
            return [
                'id' => $media->getId(),
                'titre' => $media->getTitre(),
                'image' => $this->getPhotoUrl($media->getImage(), 'medias'),
                'link_url' => $media->getLinkUrl(),
                'exposition_id' => $media->getExposition() ? $media->getExposition()->getId() : null,
                'evenement_id' => $media->getEvenement() ? $media->getEvenement()->getId() : null,
                'artiste_id' => $media->getArtiste() ? $media->getArtiste()->getId() : null,
                'published' => $media->isPublished(),
            ];
        }, $medias);
        return $this->json($data);
    }

    #[Route('/admin/api/{id}', name: 'api_media_show', methods: ['GET'])]
    public function getMedia(EntityManagerInterface $em, int $id): Response
    {
        $media = $em->getRepository(Medias::class)->find($id);
        if (!$media) {
            return $this->json(['error' => 'Media not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json([
            'id' => $media->getId(),
            'titre' => $media->getTitre(),
            'image' => $this->getPhotoUrl($media->getImage(), 'medias'),
            'link_url' => $media->getLinkUrl(),
            'exposition_id' => $media->getExposition() ? $media->getExposition()->getId() : null,
            'evenement_id' => $media->getEvenement() ? $media->getEvenement()->getId() : null,
            'artiste_id' => $media->getArtiste() ? $media->getArtiste()->getId() : null,
            'published' => $media->isPublished(),
        ]);
    }

    #[Route('/admin/api', name: 'api_media_create', methods: ['POST'])]
    public function createMedia(Request $request, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        $media = new Medias();
        $media->setTitre($data['titre'] ?? '');
        $media->setLinkUrl($data['link_url'] ?? '');
        $media->setPublished($data['published'] ?? false);
        // Image upload
        if (!empty($data['image'])) {
            try {
                $imagePath = $this->handleImageUpload($data['image']);
                $media->setImage($imagePath);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
        // Relations
        if (!empty($data['exposition_id'])) {
            $expo = $em->getRepository(Exposition::class)->find($data['exposition_id']);
            if ($expo) $media->setExposition($expo);
        }
        if (!empty($data['evenement_id'])) {
            $ev = $em->getRepository(Evenement::class)->find($data['evenement_id']);
            if ($ev) $media->setEvenement($ev);
        }
        if (!empty($data['artiste_id'])) {
            $art = $em->getRepository(Artiste::class)->find($data['artiste_id']);
            if ($art) $media->setArtiste($art);
        }
        $em->persist($media);
        $em->flush();
        return $this->json(['id' => $media->getId()], Response::HTTP_CREATED);
    }

    #[Route('/admin/api/{id}', name: 'api_media_update', methods: ['PUT'])]
    public function updateMedia(Request $request, EntityManagerInterface $em, int $id): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        $media = $em->getRepository(Medias::class)->find($id);
        if (!$media) {
            return $this->json(['error' => 'Media not found'], Response::HTTP_NOT_FOUND);
        }
        if (array_key_exists('titre', $data)) $media->setTitre($data['titre']);
        if (array_key_exists('link_url', $data)) $media->setLinkUrl($data['link_url']);
        if (array_key_exists('published', $data)) $media->setPublished($data['published']);
        // Image upload
        if (isset($data['image'])) {
            if (!empty($data['image']) && strpos($data['image'], 'data:image') === 0) {
                // New base64 image uploaded - delete old image first
                $oldImage = $media->getImage();
                if ($oldImage && !empty($oldImage)) {
                    $this->deleteOldImage($oldImage);
                }
                try {
                    $imagePath = $this->handleImageUpload($data['image']);
                    $media->setImage($imagePath);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
            elseif (empty($data['image'])) {
                // If image is empty, set it to null
                $media->setImage(null);
            }
        }
        // Relations
        if (array_key_exists('exposition_id', $data)) {
            $expo = $em->getRepository(Exposition::class)->find($data['exposition_id']);
            $media->setExposition($expo);
        }
        if (array_key_exists('evenement_id', $data)) {
            $ev = $em->getRepository(Evenement::class)->find($data['evenement_id']);
            $media->setEvenement($ev);
        }
        if (array_key_exists('artiste_id', $data)) {
            $art = $em->getRepository(Artiste::class)->find($data['artiste_id']);
            $media->setArtiste($art);
        }
        $em->persist($media);
        $em->flush();
        return $this->json(['id' => $media->getId()], Response::HTTP_OK);
    }

    #[Route('/admin/api/{id}', name: 'api_media_delete', methods: ['DELETE'])]
    public function deleteMedia(EntityManagerInterface $em, int $id): Response
    {
        $media = $em->getRepository(Medias::class)->find($id);
        if (!$media) {
            return $this->json(['error' => 'Media not found'], Response::HTTP_NOT_FOUND);
        }
        $em->remove($media);
        $em->flush();
        return $this->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    private function deleteOldImage($oldPhotoPath): void
    {
        if (!$oldPhotoPath || empty($oldPhotoPath)) {
            return;
        }

        // Remove any URL prefix to get just the filename
        $filename = basename($oldPhotoPath);
        
        // Construct the full file path
        $fullPath = $this->uploadDir . $filename;
        
        // Check if file exists and delete it
        if (file_exists($fullPath)) {
            if (unlink($fullPath)) {
                error_log('Successfully deleted old image: ' . $fullPath);
            } else {
                error_log('Failed to delete old image: ' . $fullPath);
            }
        } else {
            error_log('Old image file not found: ' . $fullPath);
        }
    }

    private function getPhotoUrl($photoPath, $folder): string
    {
        if (!$photoPath) {
            return '';
        }
        // If the photo path already contains a full URL, return it as is
        if (strpos($photoPath, 'http://') === 0 || strpos($photoPath, 'https://') === 0) {
            return $photoPath;
        }
        // If the photo path already contains /uploads/medias/, return base_url + photoPath (avoid double prefix)
        if (strpos($photoPath, '/uploads/' . $folder . '/') === 0) {
            return $this->getParameter('app.base_url') . ltrim($photoPath, '/');
        }
        // Otherwise, construct the full URL
        return $this->getParameter('app.base_url') . 'uploads/' . $folder . '/' . ltrim($photoPath, '/');
    }

}
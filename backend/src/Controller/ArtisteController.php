<?php

namespace App\Controller;

use App\Entity\Artiste;
use App\Repository\ArtisteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Intervention\Image\ImageManager;

#[Route('/artistes')]
final class ArtisteController extends AbstractController{

    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ArtisteRepository $artisteRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/artistes/';
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

    #[Route('/', name: 'app_artiste')]
    public function index(): Response
    {
        return $this->render('artiste/index.html.twig', [
            'controller_name' => 'ArtisteController',
        ]);
    }

    #[Route('/api', name: 'api_artiste' , methods: ['GET'])]
    public function api(ArtisteRepository $artistesRepository): Response
    {
        $artistes = $artistesRepository->findBy(['published' => true]);

        $artistes = array_map(function (Artiste $artiste) {
            return [
                'id' => $artiste->getId(),
                'nom' => $artiste->getNom(),
                'bio' => $artiste->getBio(),
                'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                'date_naissance' => $artiste->getDateNaissance() ? $artiste->getDateNaissance()->format('Y-m-d') : null,
                'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
                'pays' => $artiste->getPays(),
                'published' => $artiste->isPublished(),
            ];
        }, $artistes);

        return $this->json($artistes);
    }

    #[Route('/api/{id}', name: 'app_artiste_show', methods: ['GET'])]
    public function show(Artiste $artiste): Response
    {
        return $this->json([
            'id' => $artiste->getId(),
            'nom' => $artiste->getNom(),
            'bio' => $artiste->getBio(),
            'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
            'date_naissance' => $artiste->getDateNaissance()->format('Y-m-d'),
            'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
            'pays' => $artiste->getPays(),
            'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getPhotoUrl($media->getImage(), 'medias'),
                    'link_url' => $media->getLinkUrl(),
                ];
            }, $artiste->getMedias()->toArray()),
            'exposition_principale'=> array_map(function ($expo) {
                return [
                    'id' => $expo->getId(),
                    'titre' => $expo->getTitre(),
                    'description' => $expo->getDescription(),
                    'annee' => $expo->getAnnee(),
                    'date_debut' => $expo->getDateDebut() ? $expo->getDateDebut()->format('Y-m-d') : null,
                    'date_fin' => $expo->getDateFin() ? $expo->getDateFin()->format('Y-m-d') : null,
                    'image' => $this->getPhotoUrl($expo->getImage(), 'expositions'),
                    'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
                    'artiste_principal' => $expo->getArtistePrincipal() ? [
                        'id' => $expo->getArtistePrincipal()->getId(),
                        'nom' => $expo->getArtistePrincipal()->getNom(),
                        'photo' => $this->getPhotoUrl($expo->getArtistePrincipal()->getPhoto(), 'artistes'),
                    ] : null,
                    'artistes' => array_map(function ($artiste) {
                        return [
                            'id' => $artiste->getId(),
                            'nom' => $artiste->getNom(),
                            'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                        ];
                    }, $expo->getArtists()->toArray()),
                ];
            }, $artiste->getExpos()->toArray()),
            'expositions' => array_map(function ($expo) {
                return [
                    'id' => $expo->getId(),
                    'titre' => $expo->getTitre(),
                    'description' => $expo->getDescription(),
                    'annee' => $expo->getAnnee(),
                    'date_debut' => $expo->getDateDebut() ? $expo->getDateDebut()->format('Y-m-d') : null,
                    'date_fin' => $expo->getDateFin() ? $expo->getDateFin()->format('Y-m-d') : null,
                    'image' => $this->getPhotoUrl($expo->getImage(), 'expositions'),
                    'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
                    'artiste_principal' => $expo->getArtistePrincipal() ? [
                        'id' => $expo->getArtistePrincipal()->getId(),
                        'nom' => $expo->getArtistePrincipal()->getNom(),
                        'photo' => $this->getPhotoUrl($expo->getArtistePrincipal()->getPhoto(), 'artistes'),
                    ] : null,
                    'artistes' => array_map(function ($artiste) {
                        return [
                            'id' => $artiste->getId(),
                            'nom' => $artiste->getNom(),
                            'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                        ];
                    }, $expo->getArtists()->toArray()),
                ];
            }, $artiste->getExpositions()->toArray()),
            'oeuvres' => array_map(function ($oeuvre) {
                return [
                    'id' => $oeuvre->getId(),
                    'titre' => $oeuvre->getTitre(),
                    'description' => $oeuvre->getDescription(),
                    'image_principale' => $this->getPhotoUrl($oeuvre->getImagePrincipale(), 'oeuvres'),
                    'stock' => $oeuvre->getStock(),
                    'prix' => $oeuvre->getPrix(),
                ];
            }, $artiste->getOeuvres()->toArray()),
        ]);
    }

    #[Route('/admin/api', name: 'api_artiste_admin', methods: ['GET'])]
    public function apiAdmin(ArtisteRepository $artistesRepository): Response
    {
       $artistes = $artistesRepository->findAll();

        $artistes = array_map(function (Artiste $artiste) {
            return [
                'id' => $artiste->getId(),
                'nom' => $artiste->getNom(),
                'bio' => $artiste->getBio(),
                'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                'date_naissance' => $artiste->getDateNaissance() ? $artiste->getDateNaissance()->format('Y-m-d') : null,
                'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
                'pays' => $artiste->getPays(),
                'published' => $artiste->isPublished(),
            ];
        }, $artistes);

        return $this->json($artistes);
    }

    #[Route('/admin/api/', name: 'app_artiste_admin_create', methods: ['POST'])]
    public function createArtiste(Request $request, EntityManagerInterface $entityManager): Response
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], Response::HTTP_BAD_REQUEST);
            }

            $artiste = new Artiste();
            $artiste->setNom($data['nom']);
            $artiste->setBio($data['bio']);

            if (!empty($data['photo'])) {
                try {
                    $imagePath = $this->handleImageUpload($data['photo']);
                    $artiste->setPhoto($imagePath);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
            
            if (!empty($data['date_naissance'])) {
                $artiste->setDateNaissance(new \DateTime($data['date_naissance']));
            }
            
            if (!empty($data['date_deces'])) {
                $artiste->setDateDeces(new \DateTime($data['date_deces']));
            }
            
            $artiste->setPays($data['pays']);
            $artiste->setPublished($data['published']);

            $entityManager->persist($artiste);
            $entityManager->flush();

            return $this->json([
                'id' => $artiste->getId(),
                'nom' => $artiste->getNom(),
                'bio' => $artiste->getBio(),
                'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                'date_naissance' => $artiste->getDateNaissance() ? $artiste->getDateNaissance()->format('Y-m-d') : null,
                'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
                'pays' => $artiste->getPays(),
                'published' => $artiste->isPublished(),
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Server error: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/admin/api/{id}', name: 'app_artiste_admin_update', methods: ['PUT'])]
    public function updateArtiste(Request $request, Artiste $artiste, EntityManagerInterface $entityManager): Response
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                return $this->json(['error' => 'Invalid JSON: ' . json_last_error_msg()], Response::HTTP_BAD_REQUEST);
            }

            $artiste->setNom($data['nom']);
            $artiste->setBio($data['bio']);
            
            // Handle photo update
            if (isset($data['photo'])) {
                if (!empty($data['photo']) && strpos($data['photo'], 'data:image') === 0) {
                    // New base64 image uploaded - delete old image first
                    $oldPhoto = $artiste->getPhoto();
                    if ($oldPhoto && !empty($oldPhoto)) {
                        $this->deleteOldImage($oldPhoto);
                    }
                    
                    // Upload new image
                    try {
                        $imagePath = $this->handleImageUpload($data['photo']);
                        $artiste->setPhoto($imagePath);
                    } catch (\Exception $e) {
                        return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                } elseif (!empty($data['photo'])) {
                    // Existing photo URL
                    $artiste->setPhoto($data['photo']);
                }
            }
            
            if (!empty($data['date_naissance'])) {
                $artiste->setDateNaissance(new \DateTime($data['date_naissance']));
            }
            
            if (!empty($data['date_deces'])) {
                $artiste->setDateDeces(new \DateTime($data['date_deces']));
            }
            
            $artiste->setPays($data['pays']);
            $artiste->setPublished($data['published']);

            $entityManager->persist($artiste);
            $entityManager->flush();

            return $this->json([
                'id' => $artiste->getId(),
                'nom' => $artiste->getNom(),
                'bio' => $artiste->getBio(),
                'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                'date_naissance' => $artiste->getDateNaissance() ? $artiste->getDateNaissance()->format('Y-m-d') : null,
                'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
                'pays' => $artiste->getPays(),
                'published' => $artiste->isPublished(),
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Server error: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
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

    private function getPhotoUrl($photoPath, string $folder): string
    {
        if (!$photoPath) {
            return '';
        }
        
        // If the photo path already contains a full URL, return it as is
        if (strpos($photoPath, 'http://') === 0 || strpos($photoPath, 'https://') === 0) {
            return $photoPath;
        }
        
        
        // Otherwise, construct the full URL
        return $this->getParameter('app.base_url') . "uploads/" . $folder . "/" . $photoPath;
    }

    
}
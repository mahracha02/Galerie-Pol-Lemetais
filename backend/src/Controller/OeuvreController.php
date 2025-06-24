<?php

namespace App\Controller;

use App\Repository\OeuvreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Oeuvre;
use App\Entity\Artiste;
use App\Entity\Evenement;
use App\Entity\Exposition;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Intervention\Image\ImageManager;

#[Route('/oeuvres')]
final class OeuvreController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private OeuvreRepository $oeuvreRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/oeuvres/';
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

    #[Route('', name: 'app_oeuvre_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('oeuvre/index.html.twig', [
            'controller_name' => 'OeuvreController',
        ]);
    }

    #[Route('/api', name: 'api_oeuvres')]
    public function getAllOeuvresPublishe(OeuvreRepository $oeuvreRepository): Response
    {
        $oeuvres = $oeuvreRepository->findBy(['published' => true]);

        $data = array_map(function (Oeuvre $oeuvre) {
            return [
                'id' => $oeuvre->getId(),
                'titre' => $oeuvre->getTitre(),
                'description' => $oeuvre->getDescription(),
                'image_principale' => $this->getPhotoUrl($oeuvre->getImagePrincipale(), 'oeuvres'),
                'images_secondaires' => array_map(
                    fn($img) => $this->getPhotoUrl($img, 'oeuvres'),
                    array_filter(explode(',', $oeuvre->getImagesSecondaires() ?? ''))
                ),
                'dimensions' => $oeuvre->getDimensions(),
                'technique' => $oeuvre->getTechnique(),
                'remarque' => $oeuvre->getRemarque(),
                'artiste' => [
                    'id' => $oeuvre->getArtiste()->getId(),
                    'nom' => $oeuvre->getArtiste()->getNom(),
                    'photo' => $this->getPhotoUrl($oeuvre->getArtiste()->getPhoto(), 'artistes'),
                ],
                'stock' => $oeuvre->getStock(),
                'prix' => $oeuvre->getPrix(),
                
            ];
        }, $oeuvres);



        return $this->json($data);
    }

    #[Route('/api/{id}', name: 'app_oeuvre_show', methods: ['GET'])]
    public function show(OeuvreRepository $oeuvreRepository, int $id): Response
    {
        $oeuvre = $oeuvreRepository->find($id);

        if (!$oeuvre) {
            return $this->json(['error' => 'Oeuvre not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $oeuvre->getId(),
            'titre' => $oeuvre->getTitre(),
            'description' => $oeuvre->getDescription(),
            'image_principale' => $this->getPhotoUrl($oeuvre->getImagePrincipale(), 'oeuvres'),
            'images_secondaires' => array_map(
                fn($img) => $this->getPhotoUrl($img, 'oeuvres'),
                array_filter(explode(',', $oeuvre->getImagesSecondaires() ?? ''))
            ),
            'dimensions' => $oeuvre->getDimensions(),
            'technique' => $oeuvre->getTechnique(),
            'remarque' => $oeuvre->getRemarque(),
            'artiste' => [
                'id' => $oeuvre->getArtiste()->getId(),
                'nom' => $oeuvre->getArtiste()->getNom(),
                'photo' => $this->getPhotoUrl($oeuvre->getArtiste()->getPhoto(), 'artistes'),
            ],
            'stock' => $oeuvre->getStock(),
            'prix' => $oeuvre->getPrix(),
        ]);
    }

    #[Route('/admin/api', name: 'api_oeuvres' , methods: ['GET'])]
    public function getAllOeuvres(OeuvreRepository $oeuvreRepository): Response
    {
        $oeuvres = $oeuvreRepository->findAll();

        $data = array_map(function (Oeuvre $oeuvre) {
            return [
                'id' => $oeuvre->getId(),
                'titre' => $oeuvre->getTitre(),
                'description' => $oeuvre->getDescription(),
                'image_principale' => $this->getPhotoUrl($oeuvre->getImagePrincipale(), 'oeuvres'),
                'images_secondaires' => array_map(
                    fn($img) => $this->getPhotoUrl($img, 'oeuvres'),
                    array_filter(explode(',', $oeuvre->getImagesSecondaires() ?? ''))
                ),
                'dimensions' => $oeuvre->getDimensions(),
                'annee' => $oeuvre->getAnnee(),
                'technique' => $oeuvre->getTechnique(),
                'remarque' => $oeuvre->getRemarque(),
                'artiste' => [
                    'id' => $oeuvre->getArtiste()->getId(),
                    'nom' => $oeuvre->getArtiste()->getNom(),
                    'photo' => $this->getPhotoUrl($oeuvre->getArtiste()->getPhoto(), 'artistes'),
                ],
                'expositions' => $oeuvre->getExposition() ? [
                    'id' => $oeuvre->getExposition()->getId(),
                    'titre' => $oeuvre->getExposition()->getTitre(),
                    'date_debut' => $oeuvre->getExposition()->getDateDebut(),
                    'date_fin' => $oeuvre->getExposition()->getDateFin(),
                ] : null,
                'evenements' => array_map(function ($evenement) {
                    return [
                        'id' => $evenement->getId(),
                        'titre' => $evenement->getTitre(),
                    ];
                }, $oeuvre->getEvenement()->toArray()),
                'stock' => $oeuvre->getStock(),
                'prix' => $oeuvre->getPrix(),
                'published' => $oeuvre->isPublished(),
            ];
        }, $oeuvres);



        return $this->json($data);
    }

    // Route pour obtenir toutes les œuvres d'un artiste
    #[Route('/api/artiste/{artisteId}', name: 'app_artiste_oeuvres_show', methods: ['GET'])]
    public function showArtisteOeuvres(OeuvreRepository $oeuvreRepository, int $artisteId): Response
    {
        // Récupérer toutes les œuvres associées à un artiste
        $oeuvres = $oeuvreRepository->findBy(['artiste' => $artisteId]);

        if (empty($oeuvres)) {
            return $this->json(['error' => 'Aucune œuvre trouvée pour cet artiste'], Response::HTTP_NOT_FOUND);
        }

        // Retourner la liste des œuvres de l'artiste
        $oeuvresData = array_map(function ($oeuvre) {
            return [
                'id' => $oeuvre->getId(),
                'titre' => $oeuvre->getTitre(),
                'description' => $oeuvre->getDescription(),
                'image_principale' => $this->getPhotoUrl($oeuvre->getImagePrincipale(), 'oeuvres'),
                'images_secondaires' => array_map(
                    fn($img) => $this->getPhotoUrl($img, 'oeuvres'),
                    array_filter(explode(',', $oeuvre->getImagesSecondaires() ?? ''))
                ),
                'dimensions' => $oeuvre->getDimensions(),
                'technique' => $oeuvre->getTechnique(),
                'remarque' => $oeuvre->getRemarque(),
            ];
        }, $oeuvres);

        return $this->json($oeuvresData);
    }

    #[Route('/admin/api', name: 'app_oeuvre_create', methods: ['POST'])]
    public function createOeuvre(Request $request, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }

        $oeuvre = new Oeuvre();
        $oeuvre->setTitre($data['titre'] ?? '');
        $oeuvre->setDescription($data['description'] ?? '');
        $oeuvre->setDimensions($data['dimensions'] ?? '');
        $oeuvre->setTechnique($data['technique'] ?? '');
        $oeuvre->setRemarque($data['remarque'] ?? '');
        $oeuvre->setAnnee($data['annee'] ?? null);
        $oeuvre->setStock($data['stock'] ?? 0);
        $oeuvre->setPrix($data['prix'] ?? 0);
        $oeuvre->setPublished($data['published'] ?? false);
        
        // Gestion de l'image principale
        if (!empty($data['image_principale'])) {
            try {
                $imagePath = $this->handleImageUpload($data['image_principale']);
                $oeuvre->setImagePrincipale($imagePath);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
        // Gestion des images secondaires
        if (!empty($data['images_secondaires'])) {
            $images = [];
            foreach ($data['images_secondaires'] as $imageData) {
                try {
                    $imagePath = $this->handleImageUpload($imageData);
                    if ($imagePath) {
                        $images[] = $imagePath;
                    }
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
            $oeuvre->setImagesSecondaires(implode(',', $images));
        } else {
            $oeuvre->setImagesSecondaires('');
        }
    

        // Gestion de l'artiste principal
        if (!empty($data['artiste_id'])) {
            if (is_numeric($data['artiste_id'])) {
                $artiste = $em->getRepository(Artiste::class)->find($data['artiste_id']);
                if ($artiste) {
                    $oeuvre->setArtiste($artiste);
                }
            } else {
                // Si c'est un nom d'artiste, on le crée
                $artiste = new Artiste();
                $artiste->setNom($data['artiste']);
                $em->persist($artiste);
                $oeuvre->setArtiste($artiste);
            }
        }

        // Gestion de l'exposition
        if (!empty($data['exposition_id'])) {
            $exposition = $em->getRepository(Exposition::class)->find($data['exposition_id']);
            if ($exposition) {
                $oeuvre->setExposition($exposition);
            }
        }

        // Gestion des événements
        if (!empty($data['evenements'])) {
            foreach ($data['evenements'] as $evenementId) {
                $evenement = $em->getRepository(Evenement::class)->find($evenementId);
                if ($evenement) {
                    $oeuvre->getEvenement()->add($evenement);
                }
            }
        }

        $em->persist($oeuvre);
        $em->flush();

        return $this->json(['id' => $oeuvre->getId()], Response::HTTP_CREATED);
    }

    #[Route('/admin/api/{id}', name: 'app_oeuvre_update', methods: ['PUT'])]
    public function updateOeuvre(Request $request, EntityManagerInterface $em, int $id): Response
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }

        $oeuvre = $this->oeuvreRepository->find($id);
        if (!$oeuvre) {
            return $this->json(['error' => 'Oeuvre not found'], Response::HTTP_NOT_FOUND);
        }

        // Store old image path for deletion later
        $oldPhotoPath = $oeuvre->getImagePrincipale();

        // Only update fields present in the request
        if (array_key_exists('titre', $data)) {
            $oeuvre->setTitre($data['titre']);
        }
        if (array_key_exists('description', $data)) {
            $oeuvre->setDescription($data['description']);
        }
        if (array_key_exists('dimensions', $data)) {
            $oeuvre->setDimensions($data['dimensions']);
        }
        if (array_key_exists('technique', $data)) {
            $oeuvre->setTechnique($data['technique']);
        }
        if (array_key_exists('remarque', $data)) {
            $oeuvre->setRemarque($data['remarque']);
        }
        if (array_key_exists('annee', $data)) {
            $oeuvre->setAnnee($data['annee']);
        }
        if (array_key_exists('stock', $data)) {
            $oeuvre->setStock($data['stock']);
        }
        if (array_key_exists('prix', $data)) {
            $oeuvre->setPrix($data['prix']);
        }
        if (array_key_exists('published', $data)) {
            $oeuvre->setPublished($data['published']);
        }

        // Handle image principale
        if (!empty($data['image_principale'])) {
            try {
                $imagePath = $this->handleImageUpload($data['image_principale']);
                if ($imagePath) {
                    // Delete old image if it exists
                    $this->deleteOldImage($oldPhotoPath);
                    $oeuvre->setImagePrincipale($imagePath);
                }
            } catch (\Exception $e) {
                return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        // Handle images secondaires
        if (!empty($data['images_secondaires'])) {
            $images = [];
            foreach ($data['images_secondaires'] as $imageData) {
                try {
                    $imagePath = $this->handleImageUpload($imageData);
                    if ($imagePath) {
                        $images[] = $imagePath;
                    }
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
            $oeuvre->setImagesSecondaires(implode(',', $images));
        }

        // Handle artiste principal
        if (!empty($data['artiste_id'])) {
            if (is_numeric($data['artiste_id'])) {
                $artiste = $this->entityManager->getRepository(Artiste::class)->find($data['artiste_id']);
                if ($artiste) {
                    $oeuvre->setArtiste($artiste);
                }
            } else {
                // If it's an artist name, create a new one
                $artiste = new Artiste();
                $artiste->setNom($data['artiste']);
                $this->entityManager->persist($artiste);
                $oeuvre->setArtiste($artiste);
            }   
        }

        // Handle exposition
        if (!empty($data['exposition_id'])) {
            $exposition = $this->entityManager->getRepository(Exposition::class)->find($data['exposition_id']);
            if ($exposition) {
                $oeuvre->setExposition($exposition);
            } else {
                $oeuvre->setExposition(null); // Clear exposition if not found
            }
        } else if (array_key_exists('exposition', $data)) {
            // If the key exists 
            $oeuvre->setExposition($data['exposition']);
        }

        // Handle evenements
        if (!empty($data['evenements'])) {
            $oeuvre->getEvenement()->clear(); // Clear existing events
            foreach ($data['evenements'] as $evenementId) {
                $evenement = $this->entityManager->getRepository(Evenement::class)->find($evenementId);
                if ($evenement) {
                    $oeuvre->getEvenement()->add($evenement);
                }
            }
        } else if (array_key_exists('evenements', $data)) {
            // If the key exists but is empty, clear the events field
            $oeuvre->getEvenement()->clear();
        }
        $em->persist($oeuvre);
        $em->flush();

        return $this->json(['id' => $oeuvre->getId()], Response::HTTP_OK);
    }

    #[Route('/admin/api/{id}', name: 'app_oeuvre_delete', methods: ['DELETE'])]
    public function deleteOeuvre(int $id, EntityManagerInterface $em): Response
    {
        $oeuvre = $this->oeuvreRepository->find($id);
        if (!$oeuvre) {
            return $this->json(['error' => 'Oeuvre not found'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($oeuvre);
        $em->flush();

        return $this->json(['success' => 'Oeuvre deleted'], Response::HTTP_NO_CONTENT);
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
        
        // Otherwise, construct the full URL
        return $this->getParameter('app.base_url') . "uploads/" . $folder . "/" . $photoPath;
    }

}

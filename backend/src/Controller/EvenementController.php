<?php

namespace App\Controller;

use App\Entity\Evenement;
use App\Entity\Artiste;
use App\Entity\Actualites as Actualite;
use App\Repository\EvenementRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use IntlDateFormatter;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Intervention\Image\ImageManager;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/evenements')]
final class EvenementController extends AbstractController{

    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private EvenementRepository $evenementRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/evenements/';
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

    #[Route('', name: 'app_evenement_index', methods: ['GET'])]
    public function index(EvenementRepository $evenementsRepository): Response
    {
        $evenements =$evenementsRepository->findAll();
        return $this->render('evenement/index.html.twig', [
            'evenements'=>$evenements,
        ]);
    }

    //Api
    #[Route('/admin/api', name:'appi_evenements',methods:['GET'])]
    public function getAllEvenements (EvenementRepository $evenementsRepository):Response
    {
        $evenements= $evenementsRepository->findAll();
        // Création du formateur de date en français
        $formatter = new IntlDateFormatter(
            'fr_FR',
            IntlDateFormatter::LONG,
            IntlDateFormatter::NONE
        );

        $data= array_map(function(Evenement $event) use ($formatter)
        {
            return [
                'id'=> $event->getId(),
                'titre'=> $event->getTitre(),
                'description'=> $event->getDescription(),
                'date_debut'=> $formatter->format($event->getDateDebut()), 
                'date_fin'=> $formatter->format($event->getDateFin()),
                'lieu'=> $event->getLieu(),
                'image' => $this->getPhotoUrl($event->getImage(), 'evenements'),
                'site_url'=> $event->getSiteUrl(),
                'artiste_principal' => $event->getArtistePrincipal() ? [
                    'id' => $event->getArtistePrincipal()->getId(),
                    'nom' => $event->getArtistePrincipal()->getNom(),
                    'photo' => $this->getPhotoUrl($event->getArtistePrincipal()->getPhoto(), 'artistes'),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                    ];
                }, $event->getArtists()->toArray()),
                'published' => $event->isPublished(),
            ];

        }, $evenements);

        return $this->json($data);
    }

    #[Route('/api/published', name: 'api_evenements_published', methods: ['GET'])]
    public function getPublishedEvenements(EvenementRepository $evenementsRepository): JsonResponse
    {
        $evenements = $evenementsRepository->findBy(['published' => true]);
        
        $formatter = new IntlDateFormatter(
            'fr_FR',
            IntlDateFormatter::LONG,
            IntlDateFormatter::NONE
        );

        $data= array_map(function(Evenement $event) use ($formatter)
        {
            return [
                'id'=> $event->getId(),
                'titre'=> $event->getTitre(),
                'description'=> $event->getDescription(),
                'date_debut'=> $formatter->format($event->getDateDebut()), 
                'date_fin'=> $formatter->format($event->getDateFin()),
                'lieu'=> $event->getLieu(),
                'image' => $this->getPhotoUrl($event->getImage(), 'evenements'),
                'site_url'=> $event->getSiteUrl(),
                'artiste_principal' => $event->getArtistePrincipal() ? [
                    'id' => $event->getArtistePrincipal()->getId(),
                    'nom' => $event->getArtistePrincipal()->getNom(),
                    'photo' => $this->getPhotoUrl($event->getArtistePrincipal()->getPhoto(), 'artistes'),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                    ];
                }, $event->getArtists()->toArray()),
                'published' => $event->isPublished(),
            ];

        }, $evenements);

        return $this->json($data);
    }

    #[Route('/api/{id}', name: 'api_evenement_show', methods: ['GET'])]
    public function showEvenement(EvenementRepository $evenementsRepository, Evenement $evenement): JsonResponse
    {
        $evenements = $evenementsRepository->findBy(['id' => $evenement->getId()]);
        
        $formatter = new IntlDateFormatter(
            'fr_FR',
            IntlDateFormatter::LONG,
            IntlDateFormatter::NONE
        );

        $data= array_map(function(Evenement $event) use ($formatter)
        {
            return [
                'id'=> $event->getId(),
                'titre'=> $event->getTitre(),
                'description'=> $event->getDescription(),
                'date_debut'=> $formatter->format($event->getDateDebut()), 
                'date_fin'=> $formatter->format($event->getDateFin()),
                'lieu'=> $event->getLieu(),
                'image' => $this->getPhotoUrl($event->getImage(), 'evenements'),
                'site_url'=> $event->getSiteUrl(),
                'oeuvres' => array_map(function ($oeuvre) {
                    return [
                        'id' => $oeuvre->getId(),
                        'titre' => $oeuvre->getTitre(),
                        'description' => $oeuvre->getDescription(),
                        'image_principale' => $this->getPhotoUrl($oeuvre->getImagePrincipale(), 'oeuvres'),
                        'prix' => $oeuvre->getPrix(),
                        'stock' => $oeuvre->getStock(),
                    ];
                }, $event->getOeuvres()->toArray()),
                'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getPhotoUrl($media->getImage(), 'medias'),
                    'link_url' => $media->getLinkUrl(),
                ];
            }, $event->getMedias()->toArray()),
                'artiste_principal' => $event->getArtistePrincipal() ? [
                    'id' => $event->getArtistePrincipal()->getId(),
                    'nom' => $event->getArtistePrincipal()->getNom(),
                    'photo' => $this->getPhotoUrl($event->getArtistePrincipal()->getPhoto(), 'artistes'),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getPhotoUrl($artiste->getPhoto(), 'artistes'),
                    ];
                }, $event->getArtists()->toArray()),
                'published' => $event->isPublished(),
            ];

        }, $evenements);

        return $this->json($data);
    }
    #[Route('/admin/api/', name: 'api_evenement_add', methods: ['POST'])]
    public function addEvenement(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Données invalides',
                    'details' => json_last_error_msg()
                ], Response::HTTP_BAD_REQUEST);
            }

            // Validation des champs requis
            if (empty($data['titre']) || empty($data['date_debut']) || empty($data['date_fin']) || empty($data['lieu'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Champs requis manquants',
                    'details' => 'Titre, date de début, date de fin et lieu sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            try {
                $evenement = new Evenement();
                $evenement->setTitre($data['titre']);
                $evenement->setDescription($data['description'] ?? '');
                $evenement->setDateDebut(new \DateTime($data['date_debut']));
                $evenement->setDateFin(new \DateTime($data['date_fin']));
                $evenement->setLieu($data['lieu']);
                $evenement->setSiteUrl($data['site_url'] ?? '');
                $evenement->setPublished($data['published'] ?? false);

                if (!empty($data['image'])) {
                    try {
                        $imagePath = $this->handleImageUpload($data['image']);
                        $evenement->setImage($imagePath);
                    } catch (\Exception $e) {
                        return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                }

                // Gestion de l'artiste principal
                if (!empty($data['artiste_principal'])) {
                    $artiste = $em->getRepository(Artiste::class)->find($data['artiste_principal']);
                    if ($artiste) {
                        $evenement->setArtistePrincipal($artiste);
                    }
                }

                // Gestion des artistes associés
                if (!empty($data['artistes'])) {
                    foreach ($data['artistes'] as $artisteId) {
                        $artiste = $em->getRepository(Artiste::class)->find($artisteId);
                        if ($artiste) {
                            $evenement->addArtist($artiste);
                        }
                    }
                }

                $em->persist($evenement);

                // Création de l'actualité liée
                $actualite = new Actualite();
                $actualite->setTitre('Nouvel événement : ' . $evenement->getTitre());
                $actualite->setDate(new \DateTime());
                $actualite->setDescription($evenement->getDescription());
                $actualite->setImage($evenement->getImage());
                $actualite->setLink($evenement->getSiteUrl());
                $actualite->setNouveau(true);
                $actualite->setPublished($evenement->isPublished());
                $actualite->setEvenement($evenement);

                $em->persist($actualite);
                $em->flush();

                return new JsonResponse([
                    'success' => true,
                    'message' => 'Événement et actualité ajoutés avec succès',
                    'data' => [
                        'id' => $evenement->getId(),
                        'titre' => $evenement->getTitre()
                    ]
                ], Response::HTTP_CREATED);

            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Erreur lors de la création de l\'événement',
                    'details' => $e->getMessage()
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Erreur serveur',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/admin/api/{id}', name: 'api_evenement_edit', methods: ['PUT'])]
    public function edit(Request $request, Evenement $evenement, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                error_log('Invalid JSON data received');
                return new JsonResponse(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
            }

            error_log('Received data: ' . print_r($data, true));

            // Validation des champs requis
            if (empty($data['titre']) || empty($data['date_debut']) || empty($data['date_fin']) || empty($data['lieu'])) {
                error_log('Missing required fields');
                return new JsonResponse(['error' => 'Champs requis manquants'], Response::HTTP_BAD_REQUEST);
            }

            try {
                $evenement->setTitre($data['titre']);
                $evenement->setDescription($data['description'] ?? '');
                $evenement->setDateDebut(new \DateTime($data['date_debut']));
                $evenement->setDateFin(new \DateTime($data['date_fin']));
                $evenement->setLieu($data['lieu']);
                $evenement->setSiteUrl($data['site_url'] ?? '');
                $evenement->setPublished($data['published'] ?? false);
            } catch (\Exception $e) {
                error_log('Error setting event properties: ' . $e->getMessage());
                return new JsonResponse(['error' => 'Erreur lors de la mise à jour des propriétés: ' . $e->getMessage()], Response::HTTP_BAD_REQUEST);
            }

            // Gestion de l'image
            if (isset($data['image'])) {
                if (!empty($data['image']) && strpos($data['image'], 'data:image') === 0) {
                    // New base64 image uploaded - delete old image first
                    $oldImage = $evenement->getImage();
                        if ($oldImage && !empty($oldImage)) {
                            $this->deleteOldImage($oldImage);
                        }
                        
                        // Upload new image
                        try {
                            $imagePath = $this->handleImageUpload($data['image']);
                            $evenement->setImage($imagePath);
                        } catch (\Exception $e) {
                            return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                        }
                    } elseif (!empty($data['image'])) {
                        // Existing image URL
                        $evenement->setImage($data['image']);
                    }
                }
             

            // Gestion de l'artiste principal
            if (!empty($data['artiste_principal'])) {
                try {
                    $artiste = $em->getRepository(Artiste::class)->find($data['artiste_principal']);
                    if ($artiste) {
                        $evenement->setArtistePrincipal($artiste);
                    }
                } catch (\Exception $e) {
                    error_log('Error setting main artist: ' . $e->getMessage());
                }
            }

            // Gestion des artistes associés
            if (!empty($data['artistes'])) {
                try {
                    $evenement->getArtists()->clear(); // Supprime les anciens artistes
                    foreach ($data['artistes'] as $artisteId) {
                        $artiste = $em->getRepository(Artiste::class)->find($artisteId);
                        if ($artiste) {
                            $evenement->addArtist($artiste);
                        }
                    }
                } catch (\Exception $e) {
                    error_log('Error setting associated artists: ' . $e->getMessage());
                }
            }

            try {
                $em->persist($evenement);

                // Mise à jour de l'actualité liée
                $actualites = $evenement->getActualites();
                if ($actualites && !$actualites->isEmpty()) {
                    foreach ($actualites as $actualite) {
                        $actualite->setTitre($evenement->getTitre());
                        $actualite->setDate(new \DateTime());
                        $actualite->setDescription($evenement->getDescription());
                        $actualite->setImage($evenement->getImage());
                        $actualite->setLink($evenement->getSiteUrl());
                        $actualite->setNouveau(true);
                        $actualite->setPublished($evenement->isPublished());
                    }
                } else {
                    $actualite = new Actualite();
                    $actualite->setTitre('Nouvel événement : ' . $evenement->getTitre());
                    $actualite->setDate(new \DateTime());
                    $actualite->setDescription($evenement->getDescription());
                    $actualite->setImage($evenement->getImage());
                    $actualite->setLink($evenement->getSiteUrl());
                    $actualite->setNouveau(true);
                    $actualite->setPublished($evenement->isPublished());
                    $actualite->setEvenement($evenement);
                    $em->persist($actualite);
                }

                $em->flush();
                error_log('Event updated successfully');
                return new JsonResponse(['message' => 'Événement et actualité mis à jour avec succès'], Response::HTTP_OK);
            } catch (\Exception $e) {
                error_log('Database error: ' . $e->getMessage());
                return new JsonResponse(['error' => 'Erreur lors de la sauvegarde en base de données: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Exception $e) {
            error_log('Global error in edit: ' . $e->getMessage());
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/admin/api/{id}', name: 'api_evenement_delete', methods: ['DELETE'])]
    public function delete(Evenement $evenement, EntityManagerInterface $em): JsonResponse
    {
        if (!$evenement) {
            return new JsonResponse(['message' => 'Événement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($evenement);
        $em->flush();

        return new JsonResponse(['message' => 'Événement supprimé avec succès'], Response::HTTP_OK);
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

<?php

namespace App\Controller;

use App\Entity\Exposition;
use App\Entity\Actualites;
use App\Entity\Artiste;
use App\Entity\Catalogue;
use App\Repository\ExpositionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Repository\ArtisteRepository;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Intervention\Image\ImageManager;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/expositions')]
final class ExpositionController extends AbstractController
{

    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ArtisteRepository $artisteRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/expositions/';
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

    // Affichage des expositions en Twig
    #[Route('', name: 'app_exposition_index', methods: ['GET'])]
    public function index(ExpositionRepository $expositionRepository): Response
    {
        $expositions = $expositionRepository->findAll();

        return $this->render('exposition/index.html.twig', [
            'expositions' => $expositions,
        ]);
    }

    // API: Liste des expositions en JSON
    #[Route('/admin/api', name: 'api_expositions', methods: ['GET'])]
    public function getAllExpositions(ExpositionRepository $expositionRepository): JsonResponse
    {
        $expositions = $expositionRepository->findAllOrderByDateDesc();
        $formatter = new \IntlDateFormatter(
            'fr_FR',
            \IntlDateFormatter::LONG,
            \IntlDateFormatter::NONE
        );


        if (empty($expositions)) {
            return $this->json(['message' => 'Aucune exposition trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer les expositions et les formater pour la réponse JSON
        // Utiliser array_map pour transformer chaque exposition en tableau associatif
        // et ajouter les informations de l'artiste principal
        // et les artistes associés
        
        $data = array_map(function (Exposition $expo) use ($formatter) {
            return [
                'id' => $expo->getId(),
                'titre' => $expo->getTitre(),
                'description' => $expo->getDescription(),
                'annee' => $expo->getAnnee(),
                'date_debut' => $formatter->format($expo->getDateDebut()),
                'date_fin' => $formatter->format($expo->getDateFin()),
                'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
                'image' => $this->getPhotoUrl($expo->getImage()),
                'catalogue' => $expo->getCatalogue() ? [
                    'id' => $expo->getCatalogue()->getId(),
                    'titre' => $expo->getCatalogue()->getTitre(),
                    'image' => $this->getPhotoUrl($expo->getCatalogue()->getImage()),
                    'link' => $expo->getCatalogue()->getLink(),
                ] : null,
                'artiste_principal' => $expo->getArtistePrincipal() ? [
                    'id' => $expo->getArtistePrincipal()->getId(),
                    'nom' => $expo->getArtistePrincipal()->getNom(),
                    'photo' => $this->getPhotoUrl($expo->getArtistePrincipal()->getPhoto()),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getPhotoUrl($artiste->getPhoto()),
                    ];
                }, $expo->getArtists()->toArray()),
                'published' => $expo->isPublished(),
            ];
        }, $expositions);

        return $this->json($data);
    }

    // API: Liste des expositions publiées
    #[Route('/api/published', name: 'api_expositions_published', methods: ['GET'])]
    public function getPublishedExpositions(ExpositionRepository $expositionRepository): JsonResponse
    {
        $expositions = $expositionRepository->findBy(['published' => true], ['dateDebut' => 'DESC']);

        if (empty($expositions)) {
            return $this->json(['message' => 'Aucune exposition trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Récupérer les expositions et les formater pour la réponse JSON
        $data = array_map(function (Exposition $expo) {
            return [
                'id' => $expo->getId(),
                'titre' => $expo->getTitre(),
                'description' => $expo->getDescription(),
                'annee' => $expo->getAnnee(),
                'date_debut' => $expo->getDateDebut()->format('Y-m-d'),
                'date_fin' => $expo->getDateFin()->format('Y-m-d'),
                'image' => $this->getPhotoUrl($expo->getImage()),
                'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
                'catalogue' => $expo->getCatalogue() ? [
                    'id' => $expo->getCatalogue()->getId(),
                    'titre' => $expo->getCatalogue()->getTitre(),
                    'image' => $this->getPhotoUrl($expo->getCatalogue()->getImage()),
                    'link' => $expo->getCatalogue()->getLink(),
                ] : null,
                'artiste_principal' => $expo->getArtistePrincipal() ? [
                    'id' => $expo->getArtistePrincipal()->getId(),
                    'nom' => $expo->getArtistePrincipal()->getNom(),
                    'photo' => $this->getPhotoUrl($expo->getArtistePrincipal()->getPhoto()),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getPhotoUrl($artiste->getPhoto()),
                    ];
                }, $expo->getArtists()->toArray()),
            ];
        }, $expositions);

        return $this->json($data);
    }

    // API: Détails d'une exposition
    #[Route('/api/{id}', name: 'api_exposition_show', methods: ['GET'])]
    public function getExposition(Exposition $exposition): JsonResponse
    {
        $formatter = new \IntlDateFormatter(
            'fr_FR',
            \IntlDateFormatter::LONG,
            \IntlDateFormatter::NONE
        );

        return $this->json([
            'id' => $exposition->getId(),
            'titre' => $exposition->getTitre(),
            'description' => $exposition->getDescription(),
            'annee' => $exposition->getAnnee(),
            'date_debut' => $formatter->format($exposition->getDateDebut()),
            'date_fin' => $formatter->format($exposition->getDateFin()),
            'image' => $this->getPhotoUrl($exposition->getImage()),
            'visite_virtuelle_url' => $exposition->getVisiteVirtuelleUrl(),
            'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getPhotoUrl($media->getImage()),
                    'link_url' => $media->getLinkUrl(),
                ];
            }, $exposition->getMedias()->toArray()),
            'oeuvres' => array_map(function ($oeuvre) {
                return [
                    'id' => $oeuvre->getId(),
                    'titre' => $oeuvre->getTitre(),
                    'image_principale' => $this->getParameter('app.base_url') . "photos/" . $oeuvre->getImagePrincipale(),
                    'dimensions' => $oeuvre->getDimensions(),
                    'annee' => $oeuvre->getAnnee(),
                    'technique' => $oeuvre->getTechnique(),
                    'remarque' => $oeuvre->getRemarque(),
                    'artiste' => [
                        'id' => $oeuvre->getArtiste()->getId(),
                        'nom' => $oeuvre->getArtiste()->getNom(),
                        'photo' => $this->getPhotoUrl($oeuvre->getArtiste()->getPhoto()),
                    ],
                ];
            }, $exposition->getOeuvres()->toArray()),
            'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getPhotoUrl($media->getImage()),
                    'link_url' => $media->getLinkUrl(),
                ];
            }, $exposition->getMedias()->toArray()),
            'catalogue' => $exposition->getCatalogue() ? [
                'id' => $exposition->getCatalogue()->getId(),
                'titre' => $exposition->getCatalogue()->getTitre(),
                'image' => $this->getPhotoUrl($exposition->getCatalogue()->getImage()),
                'link' => $exposition->getCatalogue()->getLink(),
            ] : null,
            'artiste_principal' => $exposition->getArtistePrincipal() ? [
                'id' => $exposition->getArtistePrincipal()->getId(),
                'nom' => $exposition->getArtistePrincipal()->getNom(),
                'photo' => $this->getPhotoUrl($exposition->getArtistePrincipal()->getPhoto()),
                'bio' => $exposition->getArtistePrincipal()->getBio(),
            ] : null,
            'artistes' => array_map(function ($artiste) {
                return [
                    'id' => $artiste->getId(),
                    'nom' => $artiste->getNom(),
                    'photo' => $this->getPhotoUrl($artiste->getPhoto()),
                ];
            }, $exposition->getArtists()->toArray()),
            'published' => $exposition->isPublished(),
        ]);
    }

    // API: Ajouter une nouvelle exposition
    #[Route('/admin/api/', name: 'api_exposition_add', methods: ['POST'])]
    public function createExposition(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
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
            if (empty($data['titre']) || empty($data['date_debut']) || empty($data['date_fin'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Champs requis manquants',
                    'details' => 'Titre, date de début et date de fin sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            try {
                $em->beginTransaction();

                $exposition = new Exposition();
                $exposition->setTitre($data['titre']);
                $exposition->setDescription($data['description'] ?? '');
                $exposition->setAnnee($data['annee'] ?? date('Y'));
                $exposition->setDateDebut(new \DateTime($data['date_debut']));
                $exposition->setDateFin(new \DateTime($data['date_fin']));
                $exposition->setCatalogue($data['catalogue'] ?? '');
                $exposition->setPublished($data['published'] ?? false);

                if (!empty($data['image'])) {
                    try {
                        $imagePath = $this->handleImageUpload($data['image']);
                        $exposition->setImage($imagePath);
                    } catch (\Exception $e) {
                        return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                }
            

                // Gestion de l'artiste principal
                if (!empty($data['artiste_principal'])) {
                    if (is_numeric($data['artiste_principal'])) {
                        $artiste = $em->getRepository(Artiste::class)->find($data['artiste_principal']);
                        if ($artiste) {
                            $exposition->setArtistePrincipal($artiste);
                        }
                    } else {
                        // Si c'est un nom d'artiste, on le crée
                        $artiste = new Artiste();
                        $artiste->setNom($data['artiste_principal']);
                        $em->persist($artiste);
                        $exposition->setArtistePrincipal($artiste);
                    }
                }

                // Gestion des artistes associés
                if (!empty($data['artistes'])) {
                    foreach ($data['artistes'] as $artisteData) {
                        if (is_numeric($artisteData)) {
                            $artiste = $em->getRepository(Artiste::class)->find($artisteData);
                            if ($artiste) {
                                $exposition->addArtist($artiste);
                            }
                        } else if (is_array($artisteData) && isset($artisteData['nom'])) {
                            // Si c'est un nouvel artiste avec un nom
                            $artiste = new Artiste();
                            $artiste->setNom($artisteData['nom']);
                            $em->persist($artiste);
                            $exposition->addArtist($artiste);
                        } else if (is_string($artisteData)) {
                            // Si c'est juste un nom d'artiste
                            $artiste = new Artiste();
                            $artiste->setNom($artisteData);
                            $em->persist($artiste);
                            $exposition->addArtist($artiste);
                        }
                    }
                }

                $em->persist($exposition);

                // Création de l'actualité liée
                $actualite = new Actualites();
                $actualite->setTitre('Nouvelle exposition : ' . $exposition->getTitre());
                $actualite->setDate(new \DateTime());
                $actualite->setDescription($exposition->getDescription());
                $actualite->setImage($exposition->getImage());
                $actualite->setLink($exposition->getCatalogue());
                $actualite->setNouveau(true);
                $actualite->setPublished($exposition->isPublished());
                $actualite->setExposition($exposition);
                $em->persist($actualite);

                $em->flush();
                $em->commit();

                return new JsonResponse([
                    'success' => true,
                    'message' => 'Exposition et actualité ajoutées avec succès',
                    'data' => [
                        'id' => $exposition->getId(),
                        'titre' => $exposition->getTitre()
                    ]
                ], Response::HTTP_CREATED);

            } catch (\Exception $e) {
                $em->rollback();
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Erreur lors de la création de l\'exposition',
                    'details' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Erreur serveur',
                'details' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // API: Modifier une exposition
    #[Route('/admin/api/{id}', name: 'api_exposition_edit', methods: ['PUT'])]
    public function editExposition(Request $request, Exposition $exposition, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
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
            if (empty($data['titre']) || empty($data['date_debut']) || empty($data['date_fin'])) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Champs requis manquants',
                    'details' => 'Titre, date de début et date de fin sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            try {
                $exposition->setTitre($data['titre']);
                $exposition->setDescription($data['description'] ?? '');
                $exposition->setAnnee($data['annee'] ?? date('Y'));
                $exposition->setDateDebut(new \DateTime($data['date_debut']));
                $exposition->setDateFin(new \DateTime($data['date_fin']));
                $exposition->setPublished($data['published'] ?? false);

                // Handle image update
                if (isset($data['image'])) {
                    if (!empty($data['image']) && strpos($data['image'], 'data:image') === 0) {
                        // New base64 image uploaded - delete old image first
                        $oldImage = $exposition->getImage();
                        if ($oldImage && !empty($oldImage)) {
                            $this->deleteOldImage($oldImage);
                        }
                        
                        // Upload new image
                        try {
                            $imagePath = $this->handleImageUpload($data['image']);
                            $exposition->setImage($imagePath);
                        } catch (\Exception $e) {
                            return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                        }
                    } elseif (!empty($data['image'])) {
                        // Existing image URL
                        $exposition->setImage($data['image']);
                    }
                }
                
                // Gestion du catalogue
                if (isset($data['catalogue']) && !empty($data['catalogue'])) {
                    $catalogue = $em->getRepository(Catalogue::class)->find($data['catalogue']);
                    if ($catalogue) {
                        $exposition->setCatalogue($catalogue);
                    }
                }
                // Gestion de l'artiste principal
                if (!empty($data['artiste_principal'])) {
                    $artiste = $em->getRepository(Artiste::class)->find($data['artiste_principal']);
                    if ($artiste) {
                        $exposition->setArtistePrincipal($artiste);
                    }
                }

                // Gestion des artistes associés
                if (!empty($data['artistes'])) {
                    $exposition->getArtists()->clear(); // Supprime les anciens artistes
                    foreach ($data['artistes'] as $artisteId) {
                        $artiste = $em->getRepository(Artiste::class)->find($artisteId);
                        if ($artiste) {
                            $exposition->addArtist($artiste);
                        }
                    }
                }

                $em->persist($exposition);

                // Mise à jour de l'actualité liée
                $actualites = $exposition->getActualites();
                if ($actualites && !$actualites->isEmpty()) {
                    foreach ($actualites as $actualite) {
                        $actualite->setTitre($exposition->getTitre());
                        $actualite->setDate(new \DateTime());
                        $actualite->setDescription($exposition->getDescription());
                        $actualite->setImage($exposition->getImage());
                        $actualite->setLink('test.com'); // Remplacer par le lien réel si nécessaire
                        $actualite->setNouveau(true);
                        $actualite->setPublished($exposition->isPublished());
                    }
                } else {
                    $actualite = new Actualites();
                    $actualite->setTitre('Nouvelle exposition : ' . $exposition->getTitre());
                    $actualite->setDate(new \DateTime());
                    $actualite->setDescription($exposition->getDescription());
                    $actualite->setImage($exposition->getImage());
                    $actualite->setLink('test.com'); // Remplacer par le lien réel si nécessaire
                    $actualite->setNouveau(true);
                    $actualite->setPublished($exposition->isPublished());
                    $actualite->setExposition($exposition);
                    $em->persist($actualite);
                }

                $em->flush();

                return new JsonResponse([
                    'success' => true,
                    'message' => 'Exposition et actualité mises à jour avec succès',
                    'data' => [
                        'id' => $exposition->getId(),
                        'titre' => $exposition->getTitre()
                    ]
                ], Response::HTTP_OK);

            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'error' => 'Erreur lors de la mise à jour de l\'exposition',
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

    #[Route('/admin/api/{id}', name: 'api_exposition_delete', methods: ['DELETE'])]
    public function deleteExposition(Exposition $exposition, EntityManagerInterface $em): JsonResponse
    {
        try {
            $em->remove($exposition);
            $em->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Exposition supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Erreur lors de la suppression de l\'exposition',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
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

    private function getPhotoUrl($photoPath): string
    {
        if (!$photoPath) {
            return '';
        }
        
        // If the photo path already contains a full URL, return it as is
        if (strpos($photoPath, 'http://') === 0 || strpos($photoPath, 'https://') === 0) {
            return $photoPath;
        }
        
        // Otherwise, construct the full URL
        return $this->getParameter('app.base_url') . "uploads/expositions/" . $photoPath;
    }
}

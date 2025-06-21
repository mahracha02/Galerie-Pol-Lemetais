<?php

namespace App\Controller;

use App\Entity\Exposition;
use App\Entity\Actualites;
use App\Entity\Artiste;
use App\Repository\ExpositionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/expositions')]
final class ExpositionController extends AbstractController
{
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
    #[Route('/api', name: 'api_expositions', methods: ['GET'])]
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
                'image' => $this->getParameter('app.base_url')."photos/" . $expo->getImage(),
                'catalogue' => $expo->getCatalogue(),
                'artiste_principal' => $expo->getArtistePrincipal() ? [
                    'id' => $expo->getArtistePrincipal()->getId(),
                    'nom' => $expo->getArtistePrincipal()->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/" . $expo->getArtistePrincipal()->getPhoto(),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getParameter('app.base_url')."photos/" . $artiste->getPhoto(),
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
                'image' => $this->getParameter('app.base_url')."photos/" . $expo->getImage(),
                'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
                'catalogue' => $expo->getCatalogue() ? [
                    'id' => $expo->getCatalogue()->getId(),
                    'titre' => $expo->getCatalogue()->getTitre(),
                    'image' => $this->getParameter('app.base_url') . "photos/" . $expo->getCatalogue()->getImage(),
                    'link' => $expo->getCatalogue()->getLink(),
                ] : null,
                'artiste_principal' => $expo->getArtistePrincipal() ? [
                    'id' => $expo->getArtistePrincipal()->getId(),
                    'nom' => $expo->getArtistePrincipal()->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/" . $expo->getArtistePrincipal()->getPhoto(),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getParameter('app.base_url')."photos/" . $artiste->getPhoto(),
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
            'image' => $this->getParameter('app.base_url') . "photos/" . $exposition->getImage(),
            'visite_virtuelle_url' => $exposition->getVisiteVirtuelleUrl(),
            'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getParameter('app.base_url') . "photos/" . $media->getImage(),
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
                        'photo' => $this->getParameter('app.base_url') . "photos/" . $oeuvre->getArtiste()->getPhoto(),
                    ],
                ];
            }, $exposition->getOeuvres()->toArray()),
            'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getParameter('app.base_url') . "photos/" . $media->getImage(),
                    'link_url' => $media->getLinkUrl(),
                ];
            }, $exposition->getMedias()->toArray()),
            'catalogue' => $exposition->getCatalogue() ? [
                'id' => $exposition->getCatalogue()->getId(),
                'titre' => $exposition->getCatalogue()->getTitre(),
                'image' => $this->getParameter('app.base_url') . "photos/" . $exposition->getCatalogue()->getImage(),
                'link' => $exposition->getCatalogue()->getLink(),
            ] : null,
            'artiste_principal' => $exposition->getArtistePrincipal() ? [
                'id' => $exposition->getArtistePrincipal()->getId(),
                'nom' => $exposition->getArtistePrincipal()->getNom(),
                'photo' => $this->getParameter('app.base_url')."photos/" . $exposition->getArtistePrincipal()->getPhoto(),
                'bio' => $exposition->getArtistePrincipal()->getBio(),
            ] : null,
            'artistes' => array_map(function ($artiste) {
                return [
                    'id' => $artiste->getId(),
                    'nom' => $artiste->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/" . $artiste->getPhoto(),
                ];
            }, $exposition->getArtists()->toArray()),
            'published' => $exposition->isPublished(),
        ]);
    }

    // API: Ajouter une nouvelle exposition
    #[Route('/api/add', name: 'api_exposition_add', methods: ['POST'])]
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

                // Gestion de l'image
                if (!empty($data['image'])) {
                    // Si l'image est une URL (déjà uploadée)
                    if (filter_var($data['image'], FILTER_VALIDATE_URL)) {
                        $exposition->setImage(basename($data['image']));
                    } else if (strpos($data['image'], 'data:image') === 0) {
                        // Si c'est une nouvelle image en base64
                        try {
                            // Extraire le type MIME et les données base64
                            if (preg_match('/^data:image\/(jpeg|png|jpg);base64,/', $data['image'], $matches)) {
                                $imageType = $matches[1];
                                $imageData = base64_decode(preg_replace('/^data:image\/(jpeg|png|jpg);base64,/', '', $data['image']));
                                
                                if ($imageData) {
                                    $filename = 'expo-'.uniqid() . '.' . $imageType;
                                    $uploadDir = $this->getParameter('kernel.project_dir').'/public/photos';
                                    if (!file_exists($uploadDir)) {
                                        mkdir($uploadDir, 0777, true);
                                    }
                                    file_put_contents($uploadDir . '/' . $filename, $imageData);
                                    $exposition->setImage($filename);
                                }
                            } else {
                                throw new \Exception('Format d\'image non supporté. Utilisez JPEG ou PNG.');
                            }
                        } catch (\Exception $e) {
                            $em->rollback();
                            return new JsonResponse([
                                'success' => false,
                                'error' => 'Erreur lors du traitement de l\'image',
                                'details' => $e->getMessage()
                            ], Response::HTTP_BAD_REQUEST);
                        }
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
    #[Route('/api/edit/{id}', name: 'api_exposition_edit', methods: ['PUT'])]
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
                $exposition->setCatalogue($data['catalogue'] ?? '');
                $exposition->setPublished($data['published'] ?? false);

                // Gestion de l'image
                if (!empty($data['image'])) {
                    // Si l'image est une URL (déjà uploadée)
                    if (filter_var($data['image'], FILTER_VALIDATE_URL)) {
                        $exposition->setImage(basename($data['image']));
                    } else if (strpos($data['image'], 'data:image') === 0) {
                        // Si c'est une nouvelle image en base64
                        try {
                            // Extraire le type MIME et les données base64
                            if (preg_match('/^data:image\/(jpeg|png|jpg);base64,/', $data['image'], $matches)) {
                                $imageType = $matches[1];
                                $imageData = base64_decode(preg_replace('/^data:image\/(jpeg|png|jpg);base64,/', '', $data['image']));
                                
                                if ($imageData) {
                                    $filename = 'expo-'.uniqid() . '.' . $imageType;
                                    $uploadDir = $this->getParameter('kernel.project_dir').'/public/photos';
                                    if (!file_exists($uploadDir)) {
                                        mkdir($uploadDir, 0777, true);
                                    }
                                    file_put_contents($uploadDir . '/' . $filename, $imageData);
                                    $exposition->setImage($filename);
                                }
                            } else {
                                throw new \Exception('Format d\'image non supporté. Utilisez JPEG ou PNG.');
                            }
                        } catch (\Exception $e) {
                            return new JsonResponse([
                                'success' => false,
                                'error' => 'Erreur lors du traitement de l\'image',
                                'details' => $e->getMessage()
                            ], Response::HTTP_BAD_REQUEST);
                        }
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
                        $actualite->setLink($exposition->getCatalogue());
                        $actualite->setNouveau(true);
                        $actualite->setPublished($exposition->isPublished());
                    }
                } else {
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

    #[Route('/api/{id}', name: 'api_exposition_delete', methods: ['DELETE'])]
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

    private function handleImageUpload(Request $request, SluggerInterface $slugger): ?string
    {
        $uploadedFile = $request->files->get('image');
        
        if (!$uploadedFile) {
            return null;
        }

        // Validate the file
        $allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
            throw new \RuntimeException('Invalid file type. Only JPEG and PNG are allowed.');
        }

        // Validate file size (e.g., 2MB max)
        $maxSize = 2 * 1024 * 1024;
        if ($uploadedFile->getSize() > $maxSize) {
            throw new \RuntimeException('File is too large. Maximum size is 2MB.');
        }

        // Generate a safe filename
        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();

        // Move the file to the uploads directory
        $uploadDir = $this->getParameter('uploads_directory');
        $uploadedFile->move($uploadDir, $newFilename);

        return $newFilename;
    }
}

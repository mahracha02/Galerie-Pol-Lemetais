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

#[Route('/evenements')]
final class EvenementController extends AbstractController{
    #[Route('', name: 'app_evenement_index', methods: ['GET'])]
    public function index(EvenementRepository $evenementsRepository): Response
    {
        $evenements =$evenementsRepository->findAll();
        return $this->render('evenement/index.html.twig', [
            'evenements'=>$evenements,
        ]);
    }

    //Api
    #[Route('/api', name:'appi_evenements',methods:['GET'])]
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
                'image' => $this->getParameter('app.base_url')."photos/".$event->getImage(),
                'site_url'=> $event->getSiteUrl(),
                'artiste_principal' => $event->getArtistePrincipal() ? [
                    'id' => $event->getArtistePrincipal()->getId(),
                    'nom' => $event->getArtistePrincipal()->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/" . $event->getArtistePrincipal()->getPhoto(),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getParameter('app.base_url')."photos/" . $artiste->getPhoto(),
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
                'image' => $this->getParameter('app.base_url')."photos/".$event->getImage(),
                'site_url'=> $event->getSiteUrl(),
                'artiste_principal' => $event->getArtistePrincipal() ? [
                    'id' => $event->getArtistePrincipal()->getId(),
                    'nom' => $event->getArtistePrincipal()->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/" . $event->getArtistePrincipal()->getPhoto(),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getParameter('app.base_url')."photos/" . $artiste->getPhoto(),
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
                'image' => $this->getParameter('app.base_url')."photos/".$event->getImage(),
                'site_url'=> $event->getSiteUrl(),
                'oeuvres' => array_map(function ($oeuvre) {
                    return [
                        'id' => $oeuvre->getId(),
                        'titre' => $oeuvre->getTitre(),
                        'description' => $oeuvre->getDescription(),
                        'image_principale' => $this->getParameter('app.base_url')."photos/" . $oeuvre->getImagePrincipale(),
                        'prix' => $oeuvre->getPrix(),
                        'stock' => $oeuvre->getStock(),
                    ];
                }, $event->getOeuvres()->toArray()),
                'artiste_principal' => $event->getArtistePrincipal() ? [
                    'id' => $event->getArtistePrincipal()->getId(),
                    'nom' => $event->getArtistePrincipal()->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/" . $event->getArtistePrincipal()->getPhoto(),
                ] : null,
                'artistes' => array_map(function ($artiste) {
                    return [
                        'id' => $artiste->getId(),
                        'nom' => $artiste->getNom(),
                        'photo' => $this->getParameter('app.base_url')."photos/" . $artiste->getPhoto(),
                    ];
                }, $event->getArtists()->toArray()),
                'published' => $event->isPublished(),
            ];

        }, $evenements);

        return $this->json($data);
    }
    #[Route('/api/add', name: 'api_evenement_add', methods: ['POST'])]
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

                // Gestion de l'image
                if (!empty($data['image'])) {
                    // Si l'image est une URL (déjà uploadée)
                    if (filter_var($data['image'], FILTER_VALIDATE_URL)) {
                        $evenement->setImage(basename($data['image']));
                    } else {
                        // Si c'est une nouvelle image en base64
                        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['image']));
                        if ($imageData) {
                            $filename = 'event-'.uniqid() . '.jpg';
                            $uploadDir = $this->getParameter('kernel.project_dir').'/public/photos';
                            if (!file_exists($uploadDir)) {
                                mkdir($uploadDir, 0777, true);
                            }
                            file_put_contents($uploadDir . '/' . $filename, $imageData);
                            $evenement->setImage($filename);
                        }
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

    #[Route('/api/edit/{id}', name: 'api_evenement_edit', methods: ['PUT'])]
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
            if (!empty($data['image'])) {
                try {
                    // Si l'image est une URL (déjà uploadée)
                    if (filter_var($data['image'], FILTER_VALIDATE_URL)) {
                        $evenement->setImage(basename($data['image']));
                    } else {
                        // Si c'est une nouvelle image en base64
                        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['image']));
                        if ($imageData) {
                            $filename = 'event-'.uniqid() . '.jpg';
                            $uploadDir = $this->getParameter('kernel.project_dir').'/public/photos';
                            if (!file_exists($uploadDir)) {
                                mkdir($uploadDir, 0777, true);
                            }
                            file_put_contents($uploadDir . '/' . $filename, $imageData);
                            $evenement->setImage($filename);
                        }
                    }
                } catch (\Exception $e) {
                    error_log('Error processing image: ' . $e->getMessage());
                    return new JsonResponse(['error' => 'Erreur lors du traitement de l\'image: ' . $e->getMessage()], Response::HTTP_BAD_REQUEST);
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

    #[Route('/{id}', name: 'api_evenement_delete', methods: ['DELETE'])]
    public function delete(Evenement $evenement, EntityManagerInterface $em): JsonResponse
    {
        if (!$evenement) {
            return new JsonResponse(['message' => 'Événement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($evenement);
        $em->flush();

        return new JsonResponse(['message' => 'Événement supprimé avec succès'], Response::HTTP_OK);
    }

    #[Route('/supprimer/{id}', name: 'api_evenement_delete_by_id', methods: ['DELETE'])]
    public function deleteById($id, EntityManagerInterface $em): JsonResponse
    {
        $evenement = $em->getRepository(Evenement::class)->find($id);

        if (!$evenement) {
            return new JsonResponse(['message' => 'Événement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($evenement);
        $em->flush();

        return new JsonResponse(['message' => 'Événement supprimé avec succès'], Response::HTTP_OK);
    }
}

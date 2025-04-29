<?php

namespace App\Controller;

use App\Entity\Exposition;
use App\Repository\ExpositionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

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
                'catalogue_url' => $expo->getCatalogueUrl(),
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
            'catalogue_url' => $exposition->getCatalogueUrl(),
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
        ]);
    }

    // API: Ajouter une nouvelle exposition
    #[Route('/api', name: 'api_exposition_create', methods: ['POST'])]
    public function createExposition(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $exposition = new Exposition();
        $exposition->setTitre($data['titre']);
        $exposition->setDescription($data['description']);
        $exposition->setAnnee($data['annee']);
        $exposition->setDateDebut(new \DateTime($data['date_debut']));
        $exposition->setDateFin(new \DateTime($data['date_fin']));
        $exposition->setImage($data['image']);
        $exposition->setCatalogueUrl($data['catalogue_url']);

        $em->persist($exposition);
        $em->flush();

        return $this->json(['message' => 'Exposition créée avec succès'], Response::HTTP_CREATED);
    }
}

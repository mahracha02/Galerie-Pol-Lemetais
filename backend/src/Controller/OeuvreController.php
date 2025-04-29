<?php

namespace App\Controller;

use App\Repository\OeuvreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use app\Entity\Oeuvre;

#[Route('/oeuvres')]
final class OeuvreController extends AbstractController
{
    #[Route('', name: 'app_oeuvre_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('oeuvre/index.html.twig', [
            'controller_name' => 'OeuvreController',
        ]);
    }

    #[Route('/api', name: 'api_oeuvres')]
    public function getAllOeuvres(OeuvreRepository $oeuvreRepository): Response
    {
        $oeuvres = $oeuvreRepository->findAll();

        $data = array_map(function (Oeuvre $oeuvre) {
            return [
                'id' => $oeuvre->getId(),
                'titre' => $oeuvre->getTitre(),
                'description' => $oeuvre->getDescription(),
                'image_principale' => $this->getParameter('app.base_url')."photos/".$oeuvre->getImagePrincipale(),
                'images_secondaires' => $this->getParameter('app.base_url')."photos/".$oeuvre->getImagesSecondaires(),
                'dimensions' => $oeuvre->getDimensions(),
                'technique' => $oeuvre->getTechnique(),
                'remarque' => $oeuvre->getRemarque(),
                'artiste' => [
                    'id' => $oeuvre->getArtiste()->getId(),
                    'nom' => $oeuvre->getArtiste()->getNom(),
                    'photo' => $this->getParameter('app.base_url')."photos/".$oeuvre->getArtiste()->getPhoto(),
                ],
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
            'image_principale' => $this->getParameter('app.base_url')."photos/".$oeuvre->getImagePrincipale(),
            'images_secondaires' => $this->getParameter('app.base_url')."photos/".$oeuvre->getImagesSecondaires(),
            'dimensions' => $oeuvre->getDimensions(),
            'technique' => $oeuvre->getTechnique(),
            'remarque' => $oeuvre->getRemarque(),
            'artiste' => [
                'id' => $oeuvre->getArtiste()->getId(),
                'nom' => $oeuvre->getArtiste()->getNom(),
                'photo' => $this->getParameter('app.base_url')."photos/".$oeuvre->getArtiste()->getPhoto(),
            ],
            'stock' => $oeuvre->getStock(),
            'prix' => $oeuvre->getPrix(),
        ]);
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
                'image_principale' => $this->getParameter('app.base_url') . "photos/" . $oeuvre->getImagePrincipale(),
                'images_secondaires' => $this->getParameter('app.base_url') . "photos/" . $oeuvre->getImagesSecondaires(),
                'dimensions' => $oeuvre->getDimensions(),
                'technique' => $oeuvre->getTechnique(),
                'remarque' => $oeuvre->getRemarque(),
            ];
        }, $oeuvres);

        return $this->json($oeuvresData);
    }

}

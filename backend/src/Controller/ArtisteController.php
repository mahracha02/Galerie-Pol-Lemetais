<?php

namespace App\Controller;

use App\Entity\Artiste;
use App\Repository\ArtisteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/artistes')]
final class ArtisteController extends AbstractController{
    #[Route('/', name: 'app_artiste')]
    public function index(): Response
    {
        return $this->render('artiste/index.html.twig', [
            'controller_name' => 'ArtisteController',
        ]);
    }

    #[Route('/api', name: 'api_artiste')]
    public function api(ArtisteRepository $artistesRepository): Response
    {
        $artistes = $artistesRepository->findAll();

        $artistes = array_map(function (Artiste $artiste) {
            return [
                'id' => $artiste->getId(),
                'nom' => $artiste->getNom(),
                'bio' => $artiste->getBio(),
                'photo' => $this->getParameter('app.base_url')."photos/".$artiste->getPhoto(),
                'date_naissance' => $artiste->getDateNaissance()->format('Y-m-d'),
                'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
                'pays' => $artiste->getPays(),
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
            'photo' => $this->getParameter('app.base_url')."photos/".$artiste->getPhoto(),
            'date_naissance' => $artiste->getDateNaissance()->format('Y-m-d'),
            'date_deces' => $artiste->getDateDeces() ? $artiste->getDateDeces()->format('Y-m-d') : null,
            'pays' => $artiste->getPays(),
        ]);
    }
}

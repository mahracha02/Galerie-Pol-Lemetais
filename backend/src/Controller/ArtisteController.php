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
            'medias' => array_map(function ($media) {
                return [
                    'id' => $media->getId(),
                    'titre' => $media->getTitre(),
                    'image' => $this->getParameter('app.base_url') . "photos/" . $media->getImage(),
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
                    'image' => $this->getParameter('app.base_url') . "photos/" . $expo->getImage(),
                    'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
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
            }, $artiste->getExpos()->toArray()),
            'expositions' => array_map(function ($expo) {
                return [
                    'id' => $expo->getId(),
                    'titre' => $expo->getTitre(),
                    'description' => $expo->getDescription(),
                    'annee' => $expo->getAnnee(),
                    'date_debut' => $expo->getDateDebut() ? $expo->getDateDebut()->format('Y-m-d') : null,
                    'date_fin' => $expo->getDateFin() ? $expo->getDateFin()->format('Y-m-d') : null,
                    'image' => $this->getParameter('app.base_url') . "photos/" . $expo->getImage(),
                    'visite_virtuelle_url' => $expo->getVisiteVirtuelleUrl(),
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
            }, $artiste->getExpositions()->toArray()),
            'oeuvres' => array_map(function ($oeuvre) {
                return [
                    'id' => $oeuvre->getId(),
                    'titre' => $oeuvre->getTitre(),
                    'description' => $oeuvre->getDescription(),
                    'image_principale' => $this->getParameter('app.base_url') . "photos/" . $oeuvre->getImagePrincipale(),
                    'stock' => $oeuvre->getStock(),
                    'prix' => $oeuvre->getPrix(),
                ];
            }, $artiste->getOeuvres()->toArray()),
        ]);
    }
}

<?php

namespace App\Controller;

use App\Entity\Evenement;
use App\Repository\EvenementRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use IntlDateFormatter;

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
                'artistes' => array_map(function ($artiste) {
                    return [
                            'id' => $artiste->getId(),
                            'nom' => $artiste->getNom(),
                        ];
                }, $event->getArtists()->toArray()),
            ];

        }, $evenements);

        return $this->json($data);
    }
}

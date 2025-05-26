<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Repository\ContactRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/contacts')]
final class ContactController extends AbstractController{
    #[Route('/', name: 'app_contact')]
    public function index(): Response
    {
        return $this->render('contact/index.html.twig', [
            'controller_name' => 'ContactController',
        ]);
    }

    #[Route('/api', name: 'api_contact')]
    public function getAllContacts(ContactRepository $contactRepository): Response
    {
        $contacts = $contactRepository->findAll();

        $data = array_map(function (Contact $contact) {
            return [
                'id' => $contact->getId(),
                'nom' => $contact->getNom(),
                'prenom' => $contact->getPrenom(),
                'telephone' => $contact->getTelephone(),
                'email' => $contact->getEmail(),
                'message' => $contact->getMessage(),
                'createdDate' => $contact->getCreatedDate()->format('Y-m-d H:i:s'),
            ];
        }, $contacts);

        return $this->json($data);
    }
    #[Route('/api/{id}', name: 'api_contact_show', methods: ['GET'])]
    public function showContact(Contact $contact): Response
    {
        return $this->json([
            'id' => $contact->getId(),
            'nom' => $contact->getNom(),
            'prenom' => $contact->getPrenom(),
            'telephone' => $contact->getTelephone(),
            'email' => $contact->getEmail(),
            'message' => $contact->getMessage(),
            'createdDate' => $contact->getCreatedDate()->format('Y-m-d H:i:s'),
        ]);
    }       
    
    //API: Créer un contact
    #[Route('/api/add', name: 'api_contact_create', methods: ['POST'])]
    public function createContact(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $contact = new Contact();
        $contact->setNom($data['nom']);
        $contact->setPrenom($data['prenom']);
        $contact->setTelephone($data['telephone']);
        $contact->setCreatedDate(new \DateTime());
        $contact->setEmail($data['email']);
        $contact->setMessage($data['message']);

        $em->persist($contact);
        $em->flush();

        return $this->json(['message' => 'Contact créé avec succès'], Response::HTTP_CREATED);
    }

    // API: Mettre à jour un contact
    #[Route('/api/{id}', name: 'api_contact_update', methods: ['PUT'])]
    public function updateContact(Request $request, Contact $contact, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['nom'])) {
            $contact->setNom($data['nom']);
        }
        if (isset($data['email'])) {
            $contact->setEmail($data['email']);
        }
        if (isset($data['message'])) {
            $contact->setMessage($data['message']);
        }

        $em->flush();

        return $this->json(['message' => 'Contact mis à jour avec succès'], Response::HTTP_OK);
    }

    // API: Supprimer un contact
    #[Route('/api/{id}', name: 'api_contact_delete', methods: ['DELETE'])]
    public function deleteContact(Contact $contact, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($contact);
        $em->flush();

        return $this->json(['message' => 'Contact supprimé avec succès'], Response::HTTP_NO_CONTENT);
    }

}    

<?php

namespace App\Controller;

use App\Entity\Admin;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\AdminRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Util\Json;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/admin/api', name: 'admin_')]
final class AdminController extends AbstractController{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private AdminRepository $adminRepository,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/list', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $admins = $this->adminRepository->findAll();

        // Map entities to array
        $data = array_map(function (Admin $admin) {
            return [
                'id' => $admin->getId(),
                'email' => $admin->getEmail(),
                'nom' => $admin->getNom(),
                'prenom' => $admin->getPrenom(),
                'telephone' => $admin->getTelephone(),
                'role' => $admin->getRoles(),
            ];
        }, $admins);
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'admin:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $admin = $this->adminRepository->find($id);
        if (!$admin) {
            return new JsonResponse(['error' => 'Admin not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $admin->getId(),
            'email' => $admin->getEmail(),
            'nom' => $admin->getNom(),
            'prenom' => $admin->getPrenom(),
            'telephone' => $admin->getTelephone(),
            'role' => $admin->getRoles(),
        ];
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'admin:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['email'], $data['password'], $data['nom'], $data['prenom'], $data['telephone'])) {
            return new JsonResponse(['error' => 'Invalid input data'], Response::HTTP_BAD_REQUEST);
        }

        $admin = new Admin();
        $admin->setEmail($data['email']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, $data['password']));
        $admin->setNom($data['nom']);
        $admin->setPrenom($data['prenom']);
        $admin->setTelephone($data['telephone']);

        if (isset($data['roles']) && is_array($data['roles'])) {
            $admin->setRoles($data['roles']);
        }

        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        $data = [
            'id' => $admin->getId(),
            'email' => $admin->getEmail(),
            'nom' => $admin->getNom(),
            'prenom' => $admin->getPrenom(),
            'telephone' => $admin->getTelephone(),
            'role' => $admin->getRoles(),
        ];
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'admin:read']);
        return new JsonResponse($response, Response::HTTP_CREATED, [], true);
    }

    #[Route('/update/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $admin = $this->adminRepository->find($id);
        if (!$admin) {
            return new JsonResponse(['error' => 'Admin not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['email'], $data['password'], $data['nom'], $data['prenom'], $data['telephone'])) {
            return new JsonResponse(['error' => 'Invalid input data'], Response::HTTP_BAD_REQUEST);
        }

        $admin->setEmail($data['email']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, $data['password']));
        $admin->setNom($data['nom']);
        $admin->setPrenom($data['prenom']);
        $admin->setTelephone($data['telephone']);

        if (isset($data['roles']) && is_array($data['roles'])) {
            $admin->setRoles($data['roles']);
        }

        $this->entityManager->flush();

        $data = [
            'id' => $admin->getId(),
            'email' => $admin->getEmail(),
            'nom' => $admin->getNom(),
            'prenom' => $admin->getPrenom(),
            'telephone' => $admin->getTelephone(),
            'role' => $admin->getRoles(),
        ];
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'admin:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }       

    #[Route('/delete/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $admin = $this->adminRepository->find($id);
        if (!$admin) {
            return new JsonResponse(['error' => 'Admin not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($admin);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Admin deleted successfully'], Response::HTTP_NO_CONTENT);
    }   
    

    
}

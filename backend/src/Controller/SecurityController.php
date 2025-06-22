<?php

namespace App\Controller;

use App\Entity\Admin;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Psr\Log\LoggerInterface;

#[Route('/admin/api')]
class SecurityController extends AbstractController
{
    private $entityManager;
    private $jwtTokenManager;
    private $tokenStorage;
    private $passwordHasher;
    private $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $jwtTokenManager,
        TokenStorageInterface $tokenStorage,
        UserPasswordHasherInterface $passwordHasher,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->jwtTokenManager = $jwtTokenManager;
        $this->tokenStorage = $tokenStorage;
        $this->passwordHasher = $passwordHasher;
        $this->logger = $logger;
    }

    #[Route('/login', name: 'api_admin_login', methods: ['POST'])]
    public function login(Request $request, ?AuthenticationException $authException = null): JsonResponse
    {
        try {
            $this->logger->info('Login attempt started');

            $data = json_decode($request->getContent(), true);
            $this->logger->info('Request content: ' . $request->getContent());

            if (!$data) {
                $this->logger->error('Invalid JSON data received');
                return new JsonResponse(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
            }

            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            $this->logger->info('Attempting login for email: ' . $email);

            if (empty($email) || empty($password)) {
                $this->logger->error('Missing email or password');
                return new JsonResponse(['error' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->entityManager->getRepository(Admin::class)->findOneBy(['email' => $email]);

            if (!$user) {
                $this->logger->error('User not found for email: ' . $email);
                return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
            }

            $this->logger->info('User found, verifying password');

            if (!$this->passwordHasher->isPasswordValid($user, $password)) {
                $this->logger->error('Invalid password for user: ' . $email);
                return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
            }

            $this->logger->info('Password verified successfully');

            // Generate JWT token
            $token = $this->jwtTokenManager->create($user);

            // Store token in user entity
            $user->setToken($token);
            $user->setTokenExpiresAt(new \DateTimeImmutable('+24 hours')); // Token expires in 24 hours

            // Save the user with the new token
            $this->entityManager->flush();

            // Format roles for frontend (remove ROLE_ prefix)
            $roles = array_map(function($role) {
                return str_replace('ROLE_', '', $role);
            }, $user->getRoles());

            $this->logger->info('Login successful for user: ' . $email);

            return new JsonResponse([
                'user' => [
                    'id' => $user->getId(),
                    'nom' => $user->getNom(),
                    'prenom' => $user->getPrenom(),
                    'email' => $user->getEmail(),
                    'telephone' => $user->getTelephone(),
                    'roles' => $roles,
                    
                ],
                'token' => $token
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Login failed with exception: ' . $e->getMessage());
            return new JsonResponse(['error' => 'Authentication failed'], Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route('/logout', name: 'api_admin_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        try {
            $token = $request->headers->get('Authorization');
            if ($token) {
                $token = str_replace('Bearer ', '', $token);
                $user = $this->entityManager->getRepository(Admin::class)
                    ->findOneBy(['token' => $token]);

                if ($user) {
                    $user->setToken(null);
                    $user->setTokenExpiresAt(null);
                    $this->entityManager->flush();
                }
            }

            return new JsonResponse(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Logout failed'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

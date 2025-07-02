<?php

namespace App\Controller;

use App\Entity\Actualites;
use App\Form\ActualitesType;
use App\Repository\ActualitesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[Route('/actualites')]
final class ActualitesController extends AbstractController{

    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ActualitesRepository $actualitesRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/actualites/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    private function handleImageUpload($imageData): ?string
    {
        if (!$imageData) {
            return null;
        }

        try {
            // Check if the image data is base64
            if (strpos($imageData, 'data:image') === 0) {
                // Extract the base64 data
                $imageData = explode(',', $imageData)[1];
            }

            // Decode base64 data
            $decodedData = base64_decode($imageData);
            if ($decodedData === false) {
                throw new \Exception('Invalid base64 image data');
            }

            // Generate unique filename
            $originalFilename = uniqid() . '.png';
            $safeFilename = $this->slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.png';

            // Ensure upload directory exists
            if (!file_exists($this->uploadDir)) {
                mkdir($this->uploadDir, 0777, true);
            }

            // Save the file
            $filePath = $this->uploadDir . $newFilename;
            $result = file_put_contents($filePath, $decodedData);

            if ($result === false) {
                throw new \Exception('Failed to save image file');
            }

            // Verify the file was created
            if (!file_exists($filePath)) {
                throw new \Exception('File was not created successfully');
            }

            // Return the relative path for storage in database
            return  $newFilename;
        } catch (\Exception $e) {
            // Log the error
            error_log('Image upload error: ' . $e->getMessage());
            throw new \Exception('Failed to upload image: ' . $e->getMessage());
        }
    }

    #[Route('', name: 'api_actualites_index', methods: ['GET'])]
    public function index(ActualitesRepository $actualitesRepository): JsonResponse
    {
        $actualites = $actualitesRepository->findAll();

        // Map entities to array (expose only the fields you want)
        $data = array_map(function ($actu) {
            return [
                'id' => $actu->getId(),
                'title' => $actu->getTitle(),
                'date' => $actu->getDate() ? $actu->getDate()->format('Y-m-d') : null,
                'description' => $actu->getDescription(),
                'image' => $actu->getImage(), // Make sure you have this getter
                'link' => $actu->getLink() ?? '#', // Optional
                'nouveau' => $actu->isNouveau() ?? false, // Optional, if you have this field
            ];
        }, $actualites);

        return $this->json($data);
    }
     
    // API: Récupérer 3 actualités
    #[Route('/api', name: 'api_actualites_show', methods: ['GET'])]
    public function show(Request $request, ActualitesRepository $actualitesRepository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 3);
        $offset = ($page - 1) * $limit;

        // Récupérer les actualités publiées triées par date (descendant) avec pagination
        $actualites = $actualitesRepository->findBy(
            ['published' => true],
            ['date' => 'DESC'],
            $limit,
            $offset
        );

        if (empty($actualites)) {
            return $this->json(['message' => 'Aucune actualité trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Map entities to array (expose only the fields you want)
        $data = array_map(function ($actu) {
            return [
                'id' => $actu->getId(),
                'title' => $actu->getTitre(),
                'date' => $actu->getDate() ? $actu->getDate()->format('Y-m-d') : null,
                'description' => $actu->getDescription(),
                'image' => $this->getPhotoUrl($actu->getImage(), 'actualites'),
                'link' => $actu->getLink() ?? '#',
                'nouveau' => $actu->isNouveau() ?? false,
                'published' => $actu->isPublished() ?? false,
            ];
        }, $actualites);

        return $this->json($data);
    }

    #[Route('/api/admin', name: 'api_actualites_show_all', methods: ['GET'])]
    public function showAll(ActualitesRepository $actualitesRepository): JsonResponse
    {
        // Récupérer toutes les actualités triées par date (descendant)
        $actualites = $actualitesRepository->findBy([], ['date' => 'DESC']);

        if (empty($actualites)) {
            return $this->json(['message' => 'Aucune actualité trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Map entities to array (expose only the fields you want)
        $data = array_map(function ($actu) {
            return [
                'id' => $actu->getId(),
                'title' => $actu->getTitre(),
                'date' => $actu->getDate() ? $actu->getDate()->format('Y-m-d') : null,
                'description' => $actu->getDescription(),
                'image' => $this->getPhotoUrl($actu->getImage(), 'actualites'),
                'link' => $actu->getLink() ?? '#',
                'nouveau' => $actu->isNouveau() ?? false,
                'published' => $actu->isPublished() ?? false,
            ];
        }, $actualites);

        return $this->json($data);
    }
    #[Route('/{id}', name: 'api_actualites_show_by_id', methods: ['GET'])]
    public function showById(Actualites $actualite): JsonResponse
    {
        if (!$actualite) {
            return $this->json(['message' => 'Actualité non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $actualite->getId(),
            'title' => $actualite->getTitre(),
            'date' => $actualite->getDate() ? $actualite->getDate()->format('Y-m-d') : null,
            'description' => $actualite->getDescription(),
            'image' => $this->getPhotoUrl($actualite->getImage(), 'actualites'),
            'link' => $actualite->getLink() ?? '#',
            'nouveau' => $actualite->isNouveau() ?? false,
        ];

        return $this->json($data);
    }

    #[Route('/new', name: 'api_actualites_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $actualite = new Actualites();
        $actualite->setTitre($data['titre']);
        $actualite->setDescription($data['description']);
        $actualite->setDate(new \DateTime($data['date']));
        
        if (isset($data['image'])) {
                $imagePath = $this->handleImageUpload($data['image']);
                $actualite->setImage($imagePath);
        } 

        $actualite->setLink($data['link']);
        $actualite->setNouveau(true);
        $actualite->setPublished($data['published'] ?? false); // Optional

        $em->persist($actualite);
        $em->flush();

        return $this->json(['message' => 'Actualité crée avec succès'], Response::HTTP_CREATED);
    }

    #[Route('/edit/{id}', name: 'api_actualites_edit', methods: ['PUT'])]
    public function edit(Request $request, Actualites $actualite, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $actualite->setTitre($data['titre']);
        $actualite->setDescription($data['description']);
        $actualite->setDate(new \DateTime($data['date']));
        
        if (isset($data['image'])) {
            $imagePath = $this->handleImageUpload($data['image']);
            $actualite->setImage($imagePath);
        } else {
            $actualite->setImage(null); // Handle case where no image is provided
        }

        $actualite->setLink($data['link']);
        $actualite->setNouveau($data['nouveau'] ?? false);
        $actualite->setPublished($data['published'] ?? false);

        $em->persist($actualite);
        $em->flush();

        return $this->json(['message' => 'Actualité modifiée avec succès'], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'api_actualites_delete', methods: ['DELETE'])]
    public function delete(Actualites $actualite, EntityManagerInterface $em): JsonResponse
    {
        if (!$actualite) {
            return $this->json(['message' => 'Actualité non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($actualite);
        $em->flush();

        return $this->json(['message' => 'Actualité supprimée avec succès'], Response::HTTP_OK);    
    }

    #[Route('/supprimer/{id}', name: 'api_actualites_delete_by_id', methods: ['DELETE'])]
    public function deleteById($id, EntityManagerInterface $em): JsonResponse
    {
        $actualite = $em->getRepository(Actualites::class)->find($id);

        if (!$actualite) {
            return $this->json(['message' => 'Actualité non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($actualite);
        $em->flush();

        return $this->json(['message' => 'Actualité supprimée avec succès'], Response::HTTP_OK);    
    }

    // === ADMIN API ENDPOINTS ===
    #[Route('/admin/api', name: 'api_actualites_admin_list', methods: ['GET'])]
    public function adminList(): JsonResponse
    {
        $actualites = $this->actualitesRepository->findAll();
        $data = array_map(function (Actualites $actu) {
            return [
                'id' => $actu->getId(),
                'titre' => $actu->getTitre(),
                'description' => $actu->getDescription(),
                'date' => $actu->getDate() ? $actu->getDate()->format('Y-m-d') : null,
                'image' => $this->getPhotoUrl($actu->getImage(), 'actualites'),
                'link' => $actu->getLink() ?? '#',
                'nouveau' => $actu->isNouveau() ?? false,
                'published' => $actu->isPublished() ?? false,
            ];
        }, $actualites);
        return $this->json($data);
    }

    #[Route('/admin/api/{id}', name: 'api_actualites_admin_show', methods: ['GET'])]
    public function adminShow(int $id): JsonResponse
    {
        $actu = $this->actualitesRepository->find($id);
        if (!$actu) {
            return $this->json(['error' => 'Actualité non trouvée'], Response::HTTP_NOT_FOUND);
        }
        $data = [
            'id' => $actu->getId(),
            'titre' => $actu->getTitre(),
            'description' => $actu->getDescription(),
            'date' => $actu->getDate() ? $actu->getDate()->format('Y-m-d') : null,
            'image' => $this->getPhotoUrl($actu->getImage(), 'actualites'),
            'link' => $actu->getLink() ?? '#',
            'nouveau' => $actu->isNouveau() ?? false,
            'published' => $actu->isPublished() ?? false,
        ];
        return $this->json($data);
    }

    #[Route('/admin/api', name: 'api_actualites_admin_create', methods: ['POST'])]
    public function adminCreate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        $actualite = new Actualites();
        $actualite->setTitre($data['titre'] ?? '');
        $actualite->setDescription($data['description'] ?? '');
        $actualite->setDate(isset($data['date']) ? new \DateTime($data['date']) : new \DateTime());
        if (!empty($data['image'])) {
            try {
                $imagePath = $this->handleImageUpload($data['image']);
                $actualite->setImage($imagePath);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
        $actualite->setLink($data['link'] ?? '');
        $actualite->setNouveau($data['nouveau'] ?? false);
        $actualite->setPublished($data['published'] ?? false);
        $this->entityManager->persist($actualite);
        $this->entityManager->flush();
        return $this->json(['id' => $actualite->getId()], Response::HTTP_CREATED);
    }

    #[Route('/admin/api/{id}', name: 'api_actualites_admin_update', methods: ['PUT'])]
    public function adminUpdate(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }
        $actualite = $this->actualitesRepository->find($id);
        if (!$actualite) {
            return $this->json(['error' => 'Actualité non trouvée'], Response::HTTP_NOT_FOUND);
        }
        if (array_key_exists('titre', $data)) $actualite->setTitre($data['titre']);
        if (array_key_exists('description', $data)) $actualite->setDescription($data['description']);
        if (array_key_exists('date', $data)) $actualite->setDate(new \DateTime($data['date']));
        if (isset($data['image'])) {
            if (!empty($data['image']) && strpos($data['image'], 'data:image') === 0) {
                $oldImage = $actualite->getImage();
                if ($oldImage && !empty($oldImage)) {
                    $this->deleteOldImage($oldImage);
                }
                try {
                    $imagePath = $this->handleImageUpload($data['image']);
                    $actualite->setImage($imagePath);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Image upload failed: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            } elseif (empty($data['image'])) {
                $actualite->setImage(null);
            }
        }
        if (array_key_exists('link', $data)) $actualite->setLink($data['link']);
        if (array_key_exists('nouveau', $data)) $actualite->setNouveau($data['nouveau']);
        if (array_key_exists('published', $data)) $actualite->setPublished($data['published']);
        $this->entityManager->persist($actualite);
        $this->entityManager->flush();
        return $this->json(['id' => $actualite->getId()], Response::HTTP_OK);
    }

    #[Route('/admin/api/{id}', name: 'api_actualites_admin_delete', methods: ['DELETE'])]
    public function adminDelete(int $id): JsonResponse
    {
        $actualite = $this->actualitesRepository->find($id);
        if (!$actualite) {
            return $this->json(['error' => 'Actualité non trouvée'], Response::HTTP_NOT_FOUND);
        }
        $oldImage = $actualite->getImage();
        if ($oldImage && !empty($oldImage)) {
            $this->deleteOldImage($oldImage);
        }
        $this->entityManager->remove($actualite);
        $this->entityManager->flush();
        return $this->json(['success' => true], Response::HTTP_NO_CONTENT);
    }

    private function deleteOldImage($oldPhotoPath): void
    {
        if (!$oldPhotoPath || empty($oldPhotoPath)) {
            return;
        }
        $filename = basename($oldPhotoPath);
        $fullPath = $this->uploadDir . $filename;
        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }
    private function getPhotoUrl($photoPath, string $folder): string
    {
        if (!$photoPath) {
            return '';
        }
        
        // If the photo path already contains a full URL, return it as is
        if (strpos($photoPath, 'http://') === 0 || strpos($photoPath, 'https://') === 0) {
            return $photoPath;
        }
        
        
        // Otherwise, construct the full URL
        return $this->getParameter('app.base_url') . "uploads/" . $folder . "/" . $photoPath;
    }
}

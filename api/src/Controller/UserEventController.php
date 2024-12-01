<?php

namespace App\Controller;

use App\Repository\UserEventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
class UserEventController extends AbstractController
{
    public function __construct(
        private UserEventRepository $userEventRepository
    ) {}

    public function getEventAdmin(int $id): JsonResponse
    {
        $userEvent = $this->userEventRepository->findEventAdmin($id);

        if (!$userEvent) {
            $allUserEvents = $this->userEventRepository->findBy(['event' => $id]);
            $roles = array_map(fn($ue) => $ue->getRole(), $allUserEvents);
            
            return new JsonResponse([
                'error' => 'Administrateur non trouvé pour cet événement',
                'debug' => [
                    'event_id' => $id,
                    'existing_roles' => $roles
                ]
            ], 404);
        }

        return new JsonResponse([
            'admin_id' => $userEvent->getUser()?->getId()
        ]);
    }

    #[Route('/userevents/{id}/users', name: 'get_event_users', methods: ['GET'])]
    public function getEventUsers(int $id): JsonResponse
    {
        $userEvents = $this->userEventRepository->findEventUsers($id);

        if (empty($userEvents)) {
            return new JsonResponse([
                'error' => 'Aucun utilisateur trouvé pour cet événement'
            ], 404);
        }

        $users = array_map(function($userEvent) {
            $user = $userEvent->getUser();
            return [
                'id' => $user?->getId(),
                'email' => $user?->getEmail(),
                'username' => $user?->getUsername(),
                'firstname' => $user?->getFirstname(),
                'lastname' => $user?->getLastname(),
                'role' => $userEvent->getRole()
            ];
        }, $userEvents);

        return new JsonResponse([
            'users' => $users
        ]);
    }
} 
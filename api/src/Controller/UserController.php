<?php

namespace App\Controller;

use App\Entity\UserEvent;
use App\Repository\UserEventRepository;
use App\Service\AmazonS3Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use DateTime;

class UserController extends AbstractController
{
    private $amazonS3Service;

    public function __construct(AmazonS3Service $amazonS3Service)
    {
        $this->amazonS3Service = $amazonS3Service;
    }

    #[Route('/user/{id}/events', name: 'get_user_events', methods: ['GET'])]
    public function getUserEvents(int $id, UserEventRepository $userEventRepository): JsonResponse
    {
        $currentDate = new DateTime();
        $userEvents = $userEventRepository->findUpcomingEvents($id, $currentDate);

        // Debug information
        error_log('Current date: ' . $currentDate->format('Y-m-d H:i:s'));
        error_log('Number of events found: ' . count($userEvents));

        if (!$userEvents) {
            return $this->json(['message' => 'No events found for this user'], JsonResponse::HTTP_NOT_FOUND);
        }

        $events = [];
        foreach ($userEvents as $userEvent) {
            $imgName = $userEvent->getEvent()->getImg();
            $fullImgUrl = $imgName ? $this->amazonS3Service->getObjectUrl($imgName) : null;

            $eventData = [
                'eventId' => $userEvent->getEvent()->getId(),
                'title' => $userEvent->getEvent()->getTitle(),
                'description' => $userEvent->getEvent()->getDescription(),
                'datestart' => $userEvent->getEvent()->getDatestart()->format('Y-m-d H:i:s'),
                'dateend' => $userEvent->getEvent()->getDateend()->format('Y-m-d H:i:s'),
                'location' => $userEvent->getEvent()->getLocation(),
                'img' => $fullImgUrl,
                'visibility' => $userEvent->getEvent()->getVisibility(),
            ];

            $events[] = $eventData;
        }

        return $this->json($events, JsonResponse::HTTP_OK);
    }
}

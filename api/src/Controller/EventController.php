<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Event;
use App\Service\AmazonS3Service;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Uid\UuidV4;

class EventController extends AbstractController
{
    private $s3Service;

    public function __construct(AmazonS3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }


    #[Route('/event/create', name: 'app_event_create', methods: ['POST'])]
    public function createEvent(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Set the maximum file size to 10MB
        $maxFileSize = 8 * 1024 * 1024; // 10MB in bytes

        $data = $request->request->all();

        if (empty($data['title']) || empty($data['description']) || empty($data['datestart']) || empty($data['dateend']) || empty($data['location']) || !isset($data['visibility'])) {
            return new JsonResponse([
                'message' => 'Missing required fields.',
                'data' => $data
            ], Response::HTTP_BAD_REQUEST);
        }

        $file = $request->files->get('img');

        if ($file && $file->getSize() > $maxFileSize) {
            return new JsonResponse(['message' => 'File size exceeds the maximum limit of 10MB.'], Response::HTTP_BAD_REQUEST);
        }

        $event = new Event();
        $event->setTitle($data['title']);
        $event->setDescription($data['description']);
        $event->setDatestart(new \DateTime($data['datestart']));
        $event->setDateend(new \DateTime($data['dateend']));
        $event->setLocation($data['location']);
        if ($data['maxparticipant'] == null) {
            $data['maxparticipant'] = 0;
        }
        $event->setMaxparticipant($data['maxparticipant']);
        $event->setVisibility($data['visibility']);
        if ($file) {
            $imageName = uniqid() . '.' . $file->guessExtension();
            $uploaded = $this->s3Service->uploadObject($imageName, $file->getPathname());
            if ($uploaded) {
                $event->setImg($imageName);
            } else {
                return new JsonResponse(['message' => 'Failed to upload image to S3.'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } else {
            $event->setImg('event-background-desktop.png');
        }

        $shareLink = 'https://example.com/event/invite/' . $event->getId();
        $event->setSharelink($shareLink);

        $entityManager->persist($event);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Event created successfully',
            'event' => [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                'location' => $event->getLocation(),
                'maxparticipant' => $event->getMaxparticipant(),
                'img' => $event->getImg(),
                'sharelink' => $event->getSharelink()
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/events/upcoming', name: 'get_upcoming_events', methods: ['GET'])]
    public function getUpcomingEvents(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $currentDate = new \DateTime();

            // Get the page number from query parameters, default to 1 if not provided
            $page = $request->query->getInt('page', 1);
            $limit = 10; // Number of events per page
            $offset = ($page - 1) * $limit;

            // Create query builder
            $queryBuilder = $entityManager->createQueryBuilder();
            $queryBuilder
                ->select('e')
                ->from(Event::class, 'e')
                ->where('e.datestart > :currentDate')
                ->andWhere('e.visibility = :visibility')
                ->setParameter('currentDate', $currentDate)
                ->setParameter('visibility', true) // Assuming true means public
                ->orderBy('e.datestart', 'ASC')
                ->setMaxResults($limit)
                ->setFirstResult($offset);

            $events = $queryBuilder->getQuery()->getResult();

            // Get total count for pagination
            $totalQueryBuilder = $entityManager->createQueryBuilder();
            $totalQueryBuilder
                ->select('COUNT(e)')
                ->from(Event::class, 'e')
                ->where('e.datestart > :currentDate')
                ->andWhere('e.visibility = :visibility')
                ->setParameter('currentDate', $currentDate)
                ->setParameter('visibility', true);

            $totalEvents = $totalQueryBuilder->getQuery()->getSingleScalarResult();

            // Format the events for the response
            $formattedEvents = array_map(function ($event) {
                return [
                    'id' => $event->getId(),
                    'title' => $event->getTitle(),
                    'description' => $event->getDescription(),
                    'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
                    'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
                    'location' => $event->getLocation(),
                    'maxparticipant' => $event->getMaxparticipant(),
                    'img' => $event->getImg(),
                    'sharelink' => $event->getSharelink()
                ];
            }, $events);

            return new JsonResponse([
                'events' => $formattedEvents,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => ceil($totalEvents / $limit),
                    'total_events' => $totalEvents,
                    'events_per_page' => $limit
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'An error occurred while fetching events',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

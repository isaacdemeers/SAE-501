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
use App\Repository\EventRepository;

class EventController extends AbstractController
{
    private $s3Service;

    public function __construct(AmazonS3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }

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

    #[Route('/event/{id}', name: 'app_event_get', methods: ['POST'])]
    public function getevent(Request $request, EventRepository $eventRepository): JsonResponse
    {
        $event = $eventRepository->find($request->get('id'));
        if (!$event) {
            return $this->json(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $eventData = [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'datestart' => $event->getDatestart()->format('Y-m-d H:i:s'),
            'dateend' => $event->getDateend()->format('Y-m-d H:i:s'),
            'location' => $event->getLocation(),
            'maxparticipant' => $event->getMaxparticipant(),
            'visibility' => $event->isVisibility(),
            'sharelink' => $event->getSharelink(),
        ];

        // Get the image URL from AWS S3
        $imageName = $event->getImg();
        if ($imageName) {
            $imageUrl = $this->s3Service->getObjectUrl($imageName);
            $eventData['img'] = $imageUrl;
        } else {
            $eventData['img'] = null;
        }

        return $this->json($eventData, JsonResponse::HTTP_OK);
    }
}

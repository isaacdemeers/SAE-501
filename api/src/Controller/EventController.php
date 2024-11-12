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
     $data = json_decode($request->getContent(), true);
     $file = $request->files->get('file');
 
     $event = new Event();
     $event->setTitle($data['title']);
     $event->setDescription($data['description']);
     $event->setDatestart(new \DateTime($data['datestart']));
     $event->setDateend(new \DateTime($data['dateend']));
     $event->setLocation($data['location']);
     if($data['maxparticipant'] == null){
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
     }
     else {
         $event->setImg('default.jpg');
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
}
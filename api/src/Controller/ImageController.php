<?php

namespace App\Controller;

use App\Service\AmazonS3Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ImageController extends AbstractController
{
    private $s3Service;

    public function __construct(AmazonS3Service $s3Service)
    {
        $this->s3Service = $s3Service;
    }

    #[Route('/api/images/{imageName}', name: 'get_image_url', methods: ['GET'])]
    public function getImageUrl(string $imageName): JsonResponse
    {
        $imageUrl = $this->s3Service->getObjectUrl($imageName);
        return new JsonResponse(['url' => $imageUrl]);
    }
}
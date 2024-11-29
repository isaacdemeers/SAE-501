<?php

namespace App\Service;

use Aws\S3\S3Client;

class AmazonS3Service
{
    private $s3Client;
    private $bucketName;

    public function __construct(S3Client $s3Client, string $bucketName)
    {
        $this->s3Client = $s3Client;
        $this->bucketName = $bucketName;
    }

    public function getObjectUrl(string $key): string
    {
        // Générer une URL signée valide pendant 1 heure (3600 secondes)
        $cmd = $this->s3Client->getCommand('GetObject', [
            'Bucket' => $this->bucketName,
            'Key' => $key,
        ]);

        $request = $this->s3Client->createPresignedRequest($cmd, '+1 hour');

        // Récupérer l'URL signée
        return (string) $request->getUri();
    }

    public function uploadObject(string $key, string $filePath): bool
    {
        $fileContent = file_get_contents($filePath);

        $result = $this->s3Client->putObject([
            'Bucket' => $this->bucketName,
            'Key' => $key,
            'Body' => $fileContent,
        ]);

        return $result['@metadata']['statusCode'] === 200;
    }
}

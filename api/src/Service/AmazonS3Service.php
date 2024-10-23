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
        return $this->s3Client->getObjectUrl($this->bucketName, $key);
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
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MediasControllerTest extends WebTestCase
{
    public function testCreateMedia(): void
    {
        $mediaData = [
            'titre' => 'Test Media',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/medias/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($mediaData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateMediaWithInvalidData(): void
    {
        $mediaData = [
            'titre' => '',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/medias/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($mediaData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateMediaWithMissingRequiredFields(): void
    {
        $mediaData = [
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/medias/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($mediaData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateMediaWithXSSAttempt(): void
    {
        $mediaData = [
            'titre' => 'Test <script>alert("XSS")</script>',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/medias/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($mediaData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
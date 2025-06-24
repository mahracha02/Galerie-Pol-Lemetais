<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ActualitesControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/actualites');
        $this->assertResponseIsSuccessful();
    }

    public function testApiShow(): void
    {
        $client = static::createClient();
        $client->request('GET', '/actualites/api');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateActualite(): void
    {
        $actualiteData = [
            'titre' => 'Test Actualite',
            'description' => 'Test description',
            'date' => '2025-01-01',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/actualites/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($actualiteData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateActualiteWithInvalidData(): void
    {
        $actualiteData = [
            'titre' => '',
            'description' => '',
            'date' => '',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/actualites/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($actualiteData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateActualiteWithMissingRequiredFields(): void
    {
        $actualiteData = [
            'description' => 'Missing titre',
            'date' => '2025-01-01',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/actualites/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($actualiteData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateActualiteWithXSSAttempt(): void
    {
        $actualiteData = [
            'titre' => 'Test <script>alert("XSS")</script>',
            'description' => 'Test description',
            'date' => '2025-01-01',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/actualites/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($actualiteData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
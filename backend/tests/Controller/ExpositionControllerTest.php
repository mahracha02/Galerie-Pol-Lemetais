<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ExpositionControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/expositions');
        $this->assertResponseIsSuccessful();
    }

    public function testApiList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/expositions/api');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateExposition(): void
    {
        $expositionData = [
            'titre' => 'Test Exposition',
            'date_debut' => '2025-01-01',
            'date_fin' => '2025-01-02',
            'description' => 'Test exposition',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/expositions/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($expositionData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateExpositionWithInvalidData(): void
    {
        $expositionData = [
            'titre' => '',
            'date_debut' => '',
            'date_fin' => '',
            'description' => '',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/expositions/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($expositionData)
        );
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateExpositionWithMissingRequiredFields(): void
    {
        $expositionData = [
            'description' => 'Missing titre',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/expositions/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($expositionData)
        );
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateExpositionWithXSSAttempt(): void
    {
        $expositionData = [
            'titre' => 'Test <script>alert("XSS")</script>',
            'date_debut' => '2025-01-01',
            'date_fin' => '2025-01-02',
            'description' => 'Test exposition',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/expositions/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($expositionData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
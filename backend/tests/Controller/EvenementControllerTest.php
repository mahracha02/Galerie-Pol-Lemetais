<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class EvenementControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/evenements');
        $this->assertResponseIsSuccessful();
    }

    public function testApiList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/evenements/api');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateEvenement(): void
    {
        $evenementData = [
            'titre' => 'Test Event',
            'date_debut' => '2025-01-01',
            'date_fin' => '2025-01-02',
            'lieu' => 'Paris',
            'description' => 'Test event',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/evenements/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($evenementData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateEvenementWithInvalidData(): void
    {
        $evenementData = [
            'titre' => '',
            'date_debut' => '',
            'date_fin' => '',
            'lieu' => '',
            'description' => '',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/evenements/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($evenementData)
        );
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateEvenementWithMissingRequiredFields(): void
    {
        $evenementData = [
            'description' => 'Missing titre',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/evenements/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($evenementData)
        );
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateEvenementWithXSSAttempt(): void
    {
        $evenementData = [
            'titre' => 'Test <script>alert("XSS")</script>',
            'date_debut' => '2025-01-01',
            'date_fin' => '2025-01-02',
            'lieu' => 'Paris',
            'description' => 'Test event',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/evenements/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($evenementData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
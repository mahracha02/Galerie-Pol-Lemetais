<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class OeuvreControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/oeuvres');
        $this->assertResponseIsSuccessful();
    }

    public function testApiList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/oeuvres/api');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateOeuvre(): void
    {
        $oeuvreData = [
            'titre' => 'Test Oeuvre',
            'description' => 'Test description',
            'dimensions' => '100x100',
            'technique' => 'Oil',
            'remarque' => 'None',
            'annee' => 2020,
            'stock' => 1,
            'prix' => 1000,
            'published' => true,
            'artiste_id' => 1
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/oeuvres/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($oeuvreData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateOeuvreWithInvalidData(): void
    {
        $oeuvreData = [
            'titre' => '',
            'description' => '',
            'dimensions' => '',
            'technique' => '',
            'remarque' => '',
            'annee' => '',
            'stock' => '',
            'prix' => '',
            'published' => true,
            'artiste_id' => ''
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/oeuvres/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($oeuvreData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateOeuvreWithMissingRequiredFields(): void
    {
        $oeuvreData = [
            'description' => 'Missing titre',
            'dimensions' => '100x100',
            'technique' => 'Oil',
            'remarque' => 'None',
            'annee' => 2020,
            'stock' => 1,
            'prix' => 1000,
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/oeuvres/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($oeuvreData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateOeuvreWithXSSAttempt(): void
    {
        $oeuvreData = [
            'titre' => 'Test <script>alert("XSS")</script>',
            'description' => 'Test description',
            'dimensions' => '100x100',
            'technique' => 'Oil',
            'remarque' => 'None',
            'annee' => 2020,
            'stock' => 1,
            'prix' => 1000,
            'published' => true,
            'artiste_id' => 1
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/oeuvres/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($oeuvreData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
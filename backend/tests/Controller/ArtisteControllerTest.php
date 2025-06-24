<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArtisteControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $client->request('GET', '/artistes/');
        $this->assertResponseIsSuccessful();
    }

    public function testApiList(): void
    {
        $client = static::createClient();
        $client->request('GET', '/artistes/api');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateArtiste(): void
    {
        $artisteData = [
            'nom' => 'Test Artiste',
            'bio' => 'Test biography',
            'photo' => null,
            'date_naissance' => '1990-01-01',
            'date_deces' => null,
            'pays' => 'France',
            'published' => true,
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/artistes/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($artisteData)
        );
        $this->assertResponseStatusCodeSame(200);
    }

    public function testCreateArtisteWithInvalidData(): void
    {
        $artisteData = [
            'nom' => '',
            'bio' => '',
            'pays' => '',
            'published' => true,
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/artistes/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($artisteData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateArtisteWithMissingRequiredFields(): void
    {
        $artisteData = [
            'bio' => 'Missing nom',
            'pays' => 'France',
            'published' => true,
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/artistes/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($artisteData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateArtisteWithXSSAttempt(): void
    {
        $artisteData = [
            'nom' => 'Test <script>alert("XSS")</script>',
            'bio' => 'Test biography',
            'photo' => null,
            'date_naissance' => '1990-01-01',
            'date_deces' => null,
            'pays' => 'France',
            'published' => true,
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/artistes/admin/api/',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($artisteData)
        );
        $this->assertResponseStatusCodeSame(200);
    }
} 
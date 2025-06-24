<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CatalogueControllerTest extends WebTestCase
{
    public function testCreateCatalogue(): void
    {
        $catalogueData = [
            'titre' => 'Test Catalogue',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/catalogues/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($catalogueData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateCatalogueWithInvalidData(): void
    {
        $catalogueData = [
            'titre' => '',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/catalogues/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($catalogueData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateCatalogueWithMissingRequiredFields(): void
    {
        $catalogueData = [
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/catalogues/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($catalogueData)
        );
        $this->assertResponseStatusCodeSame(500);
    }

    public function testCreateCatalogueWithXSSAttempt(): void
    {
        $catalogueData = [
            'titre' => 'Test <script>alert("XSS")</script>',
            'published' => true
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/catalogues/admin/api',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($catalogueData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
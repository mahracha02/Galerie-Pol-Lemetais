<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AdminControllerTest extends WebTestCase
{
    public function testAdminIndex(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/admin');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1, h2, h3', 'AdminController');
    }

    public function testCreateAdmin(): void
    {
        $adminData = [
            'email' => 'testadmin@example.com',
            'password' => 'TestPassword123',
            'nom' => 'Test',
            'prenom' => 'Admin',
            'telephone' => '0123456789',
            'roles' => ['ROLE_ADMIN']
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/admin/api/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($adminData)
        );
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateAdminWithInvalidData(): void
    {
        $adminData = [
            'email' => '',
            'password' => '',
            'nom' => '',
            'prenom' => '',
            'telephone' => '',
            'roles' => []
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/admin/api/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($adminData)
        );
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateAdminWithMissingRequiredFields(): void
    {
        $adminData = [
            'email' => 'missingfields@example.com',
            'password' => 'TestPassword123',
            'roles' => ['ROLE_ADMIN']
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/admin/api/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($adminData)
        );
        $this->assertResponseStatusCodeSame(400);
    }

    public function testCreateAdminWithXSSAttempt(): void
    {
        $adminData = [
            'email' => 'xss@example.com',
            'password' => 'TestPassword123',
            'nom' => 'Test <script>alert("XSS")</script>',
            'prenom' => 'Admin',
            'telephone' => '0123456789',
            'roles' => ['ROLE_ADMIN']
        ];
        $client = static::createClient();
        $client->request(
            'POST',
            '/admin/api/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($adminData)
        );
        $this->assertResponseStatusCodeSame(201);
    }
} 
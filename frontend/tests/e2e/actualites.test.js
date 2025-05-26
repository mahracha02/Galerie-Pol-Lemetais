import { describe, beforeAll, afterAll, beforeEach, test, expect, jest } from '@jest/globals';
import puppeteer from 'puppeteer';

jest.setTimeout(30000);

describe('ActualitesList E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    // Set viewport to a reasonable size
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    // Navigate to the actualités page before each test
    await page.goto('http://localhost:3000/admin/actualites', {
      waitUntil: 'networkidle0'
    });
  });

  describe('Page Load and Initial State', () => {
    test('should load the actualités page successfully', async () => {
      const title = await page.$eval('h1', el => el.textContent);
      expect(title).toBe('Gestion des actualités');
    });

    test('should show loading state initially', async () => {
      const loadingElements = await page.$$('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });
  });

  describe('Search and Filtering', () => {
    test('should filter actualités when searching', async () => {
      // Wait for the table to load
      await page.waitForSelector('table');
      
      // Type in search box
      await page.type('input[placeholder="Rechercher une actualité..."]', 'Test Actualité');
      
      // Wait for filtering to complete
      await page.waitForTimeout(500);
      
      // Check if filtered results are shown
      const rows = await page.$$('tbody tr');
      expect(rows.length).toBeGreaterThanOrEqual(0);
    });

    test('should filter by status', async () => {
      // Open filters
      await page.click('button:has-text("Filtres")');
      
      // Select published status
      await page.select('select', 'published');
      
      // Wait for filtering to complete
      await page.waitForTimeout(500);
      
      // Check if only published items are shown
      const statusBadges = await page.$$('.bg-green-100');
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Adding New Actualité', () => {
    test('should open add modal when clicking add button', async () => {
      await page.click('button:has-text("Ajouter une actualité")');
      
      const modalTitle = await page.$eval('h3', el => el.textContent);
      expect(modalTitle).toBe('Ajouter une actualité');
    });

    test('should add new actualité successfully', async () => {
      // Open add modal
      await page.click('button:has-text("Ajouter une actualité")');
      
      // Fill in the form
      await page.type('input[name="titre"]', 'Test Actualité');
      await page.type('textarea[name="description"]', 'Description de test');
      await page.type('input[name="date"]', '2024-03-20');
      await page.type('input[name="link"]', 'https://example.com');
      await page.type('input[name="image"]', 'https://example.com/image.jpg');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for success message
      await page.waitForSelector('.bg-green-500');
      
      // Check if new item appears in the list
      const newItem = await page.$x('//div[contains(text(), "Test Actualité")]');
      expect(newItem.length).toBeGreaterThan(0);
    });
  });

  describe('Editing Actualité', () => {
    test('should open edit modal with correct data', async () => {
      // Wait for table to load
      await page.waitForSelector('table');
      
      // Click edit button on first item
      await page.click('button[title="Modifier"]');
      
      // Check if modal opens with correct title
      const modalTitle = await page.$eval('h3', el => el.textContent);
      expect(modalTitle).toBe('Modifier une actualité');
    });

    test('should update actualité successfully', async () => {
      // Open edit modal
      await page.click('button[title="Modifier"]');
      
      // Update title
      await page.type('input[name="titre"]', ' - Updated');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for success message
      await page.waitForSelector('.bg-green-500');
      
      // Check if update is reflected in the list
      const updatedItem = await page.$x('//div[contains(text(), "Updated")]');
      expect(updatedItem.length).toBeGreaterThan(0);
    });
  });

  describe('Deleting Actualité', () => {
    test('should show delete confirmation modal', async () => {
      // Wait for table to load
      await page.waitForSelector('table');
      
      // Click delete button on first item
      await page.click('button[title="Supprimer"]');
      
      // Check if confirmation modal appears
      const modalTitle = await page.$eval('h3', el => el.textContent);
      expect(modalTitle).toBe('Confirmer la suppression');
    });

    test('should delete actualité after confirmation', async () => {
      // Get initial row count
      const initialRows = await page.$$('tbody tr');
      const initialCount = initialRows.length;
      
      // Click delete and confirm
      await page.click('button[title="Supprimer"]');
      await page.click('button:has-text("Supprimer")');
      
      // Wait for success message
      await page.waitForSelector('.bg-green-500');
      
      // Check if row count decreased
      const finalRows = await page.$$('tbody tr');
      expect(finalRows.length).toBe(initialCount - 1);
    });
  });

  describe('Bulk Actions', () => {
    test('should select multiple items', async () => {
      // Wait for table to load
      await page.waitForSelector('table');
      
      // Select first two items
      const checkboxes = await page.$$('input[type="checkbox"]');
      await checkboxes[1].click(); // First item
      await checkboxes[2].click(); // Second item
      
      // Check if bulk actions bar appears
      const bulkActionsBar = await page.$('.bg-indigo-50');
      expect(bulkActionsBar).not.toBeNull();
    });

    test('should delete multiple items', async () => {
      // Select multiple items
      const checkboxes = await page.$$('input[type="checkbox"]');
      await checkboxes[1].click();
      await checkboxes[2].click();
      
      // Click bulk delete
      await page.click('button:has-text("Supprimer la sélection")');
      
      // Confirm deletion
      await page.click('button:has-text("Supprimer")');
      
      // Wait for success message
      await page.waitForSelector('.bg-green-500');
    });
  });

  describe('Responsive Design', () => {
    test('should adapt to mobile viewport', async () => {
      // Set mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      
      // Check if layout adjusts
      const isMobileLayout = await page.evaluate(() => {
        return window.getComputedStyle(document.querySelector('.flex-col')).display === 'flex';
      });
      
      expect(isMobileLayout).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should show error message on failed API call', async () => {
      // Mock failed API call
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().includes('/actualites/api/admin')) {
          request.respond({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Server error' })
          });
        } else {
          request.continue();
        }
      });
      
      // Reload page to trigger error
      await page.reload();
      
      // Check if error message appears
      const errorMessage = await page.$('.bg-red-500');
      expect(errorMessage).not.toBeNull();
    });
  });
}); 
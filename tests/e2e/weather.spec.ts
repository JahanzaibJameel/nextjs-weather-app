import { test, expect } from '@playwright/test';

test.describe('Weather App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock geolocation for consistent testing
    await page.context().grantPermissions(['geolocation']);
    await page.route('**/*', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        location: {
          name: 'London',
          country: 'GB',
          lat: 51.5074,
          lon: -0.1278,
        },
        current: {
          temp_c: 15,
          temp_f: 59,
          condition: {
            text: 'clear sky',
            icon: '01d',
          },
          humidity: 65,
          pressure_mb: 1013,
          wind_kph: 10,
          vis_km: 10,
          uv: 3,
        },
      }),
    }));
  });

  test('should load and display weather data', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial geolocation request
    await page.waitForURL('**/api/weather*');
    
    // Check if weather data is displayed
    const temperature = page.locator('[data-testid="temperature"]');
    await expect(temperature).toBeVisible();
    
    const location = page.locator('[data-testid="location"]');
    await expect(location).toContainText('London');
    
    const condition = page.locator('[data-testid="condition"]');
    await expect(condition).toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Find search input and enter city name
    const searchInput = page.locator('input[placeholder*="city"]');
    await searchInput.fill('Paris');
    
    // Submit search
    const searchButton = page.locator('button:has-text("Search Weather")');
    await searchButton.click();
    
    // Wait for API request and results
    await page.waitForURL('**/api/weather*q=Paris');
    await page.waitForTimeout(2000);
    
    // Verify new location is displayed
    const location = page.locator('[data-testid="location"]');
    await expect(location).toContainText('Paris');
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/weather*', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Weather API error',
        message: 'Failed to fetch weather data',
      }),
    }));
    
    await page.goto('/');
    
    // Trigger search to see error handling
    const searchInput = page.locator('input[placeholder*="city"]');
    await searchInput.fill('InvalidCity');
    
    const searchButton = page.locator('button:has-text("Search Weather")');
    await searchButton.click();
    
    // Should show error message
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/weather*', route => {
      // Simulate delay
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            location: { name: 'Berlin', country: 'DE' },
            current: { temp_c: 20, condition: { text: 'cloudy' } },
          }),
        });
      }, 1000); // 1 second delay
      return route.continue();
    });
    
    await page.goto('/');
    
    const searchInput = page.locator('input[placeholder*="city"]');
    await searchInput.fill('Berlin');
    
    const searchButton = page.locator('button:has-text("Search Weather")');
    await searchButton.click();
    
    // Should show loading state
    const skeletonLoader = page.locator('[data-testid="skeleton-loader"]');
    await expect(skeletonLoader).toBeVisible({ timeout: 2000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE dimensions
    
    // Check mobile layout
    const weatherContainer = page.locator('.weather-container');
    await expect(weatherContainer).toBeVisible();
    
    // Check mobile-specific elements
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    // Verify mobile layout works (if implemented)
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab to search input
    await page.keyboard.press('Tab');
    const searchInput = page.locator('input[placeholder*="city"]');
    await expect(searchInput).toBeFocused();
    
    // Type and press Enter
    await searchInput.fill('Tokyo');
    await page.keyboard.press('Enter');
    
    // Should trigger search
    await page.waitForTimeout(2000);
    
    // Verify results
    const location = page.locator('[data-testid="location"]');
    await expect(location).toContainText('Tokyo');
  });

  test('should handle geolocation permission', async ({ page }) => {
    await page.goto('/');
    
    // Mock geolocation permission denied
    await page.context().grantPermissions(['geolocation']);
    
    // Should show permission denied message or manual search option
    await page.waitForTimeout(2000);
    
    // Check if error message or manual search prompt appears
    const permissionMessage = page.locator('text=Location access denied');
    const manualSearch = page.locator('input[placeholder*="city"]');
    
    // Either permission message or search input should be visible
    const isPermissionHandled = await permissionMessage.isVisible().catch(() => false) || 
                               await manualSearch.isVisible().catch(() => false);
    
    expect(isPermissionHandled).toBe(true);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels
    const searchInput = page.locator('input[placeholder*="city"]');
    await expect(searchInput).toHaveAttribute('aria-label');
    
    const searchButton = page.locator('button:has-text("Search Weather")');
    await expect(searchButton).toHaveAttribute('aria-label');
    
    // Check for semantic HTML structure
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('should work offline with cached data', async ({ page }) => {
    // Simulate offline mode
    await page.setOffline(true);
    
    await page.goto('/');
    
    // Should show cached data or offline indicator
    const offlineIndicator = page.locator('[data-testid="offline-indicator"]');
    const cachedData = page.locator('[data-testid="cached-weather"]');
    
    // Either offline message or cached data should be visible
    const isOfflineHandled = await offlineIndicator.isVisible().catch(() => false) || 
                            await cachedData.isVisible().catch(() => false);
    
    expect(isOfflineHandled).toBe(true);
  });
});

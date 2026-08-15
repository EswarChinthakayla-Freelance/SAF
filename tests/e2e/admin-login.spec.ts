import { test, expect } from '@playwright/test'

test.describe('Admin Authentication & Security Smoke E2E', () => {
  test('rejects invalid admin login credentials with appropriate feedback and protects dashboard', async ({ page }) => {
    // 1. Visit Login Route
    await page.goto('/admin/login')
    await expect(page.locator('h1, h2')).toContainText(/Admin|Sign In|Control Panel/i)

    // 2. Submit Invalid Credentials
    await page.fill('input[type="email"]', 'unauthorized-user@example.com')
    await page.fill('input[type="password"]', 'WrongPassword123!')
    await page.click('button[type="submit"]')

    // 3. Confirm Error alert appears and page remains on /admin/login
    await expect(
      page.locator('role=alert, [class*="red"], text=Invalid, text=error')
    ).toBeVisible({ timeout: 10000 })

    expect(page.url()).toContain('/admin/login')
  })

  test('authenticates valid staging administrator when credentials are provided in environment', async ({ page }) => {
    const adminEmail = process.env.E2E_ADMIN_EMAIL
    const adminPassword = process.env.E2E_ADMIN_PASSWORD

    // Skip authenticated flow if credentials not configured in local environment
    test.skip(!adminEmail || !adminPassword, 'E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD not set')

    await page.goto('/admin/login')
    await page.fill('input[type="email"]', adminEmail!)
    await page.fill('input[type="password"]', adminPassword!)
    await page.click('button[type="submit"]')

    // Verify navigation to protected Admin Dashboard
    await expect(page).toHaveURL(/\/admin(\/dashboard)?$/)
    await expect(page.locator('text=Overview, text=Dashboard, text=Sri Anjaneya').first()).toBeVisible({ timeout: 15000 })
  })
})

import { test, expect } from '@playwright/test'

test.describe('Sri Anjaneya Furnitures — Public Commercial Flow', () => {
  test('homepage renders hero, navigation and logo branding correctly', async ({ page }) => {
    await page.goto('/')

    // Brand logo & title check
    await expect(page.locator('text=Sri Anjaneya')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()

    // Navigation links check
    await expect(page.locator('a[href="/products"]').first()).toBeVisible()
    await expect(page.locator('a[href="/collections"]').first()).toBeVisible()
    await expect(page.locator('a[href="/gallery"]').first()).toBeVisible()
    await expect(page.locator('a[href="/contact"]').first()).toBeVisible()
  })

  test('can navigate to products catalogue page', async ({ page }) => {
    await page.goto('/products')
    await expect(page.locator('h1')).toContainText(/Catalogue|Products/i)
  })

  test('can navigate to contact quote inquiry page', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('h1')).toContainText(/Contact|Quote|Inquiry/i)
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible()
  })
})

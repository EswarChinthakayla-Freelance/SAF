import { test, expect } from '@playwright/test'

test.describe('Public Discovery & Furniture Catalogue E2E', () => {
  test('visitors can browse home, discover catalogue collections, and view product specifications', async ({ page }) => {
    // 1. Visit Homepage
    await page.goto('/')
    await expect(page).toHaveTitle(/Sri Anjaneya Furnitures/i)
    await expect(page.locator('h1')).toBeVisible()

    // 2. Navigate to Products Catalogue
    const catalogueLink = page.locator('a[href="/products"]').first()
    await catalogueLink.click()
    await expect(page).toHaveURL(/\/products/)
    await expect(page.locator('h1')).toContainText(/Catalogue|Furniture/i)

    // 3. Confirm Product Grid has items
    const productCards = page.locator('a[href^="/products/"]')
    await expect(productCards.first()).toBeVisible({ timeout: 15000 })
    const cardCount = await productCards.count()
    expect(cardCount).toBeGreaterThan(0)

    // 4. Click the first published Product Card to view Detail page
    const firstProduct = productCards.first()
    await firstProduct.click()
    await expect(page).toHaveURL(/\/products\/[^/]+$/)

    // 5. Assert Product Detail layout, pricing, and CTA
    await expect(page.locator('h1')).toBeVisible()
    const quoteButton = page.locator('button:has-text("Request Quote"), button:has-text("Bespoke Quote")').first()
    await expect(quoteButton).toBeVisible()

    // 6. Navigate back to Catalogue
    await page.goBack()
    await expect(page).toHaveURL(/\/products/)
  })
})

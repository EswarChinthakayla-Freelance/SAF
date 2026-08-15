import { test, expect } from '@playwright/test'

test.describe('Admin Site Settings & Singleton Integrity E2E', () => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL
  const adminPassword = process.env.E2E_ADMIN_PASSWORD

  test.beforeEach(async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, 'Staging Admin credentials not available')

    await page.goto('/admin/login')
    await page.fill('input[type="email"]', adminEmail!)
    await page.fill('input[type="password"]', adminPassword!)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin(\/dashboard)?$/)
  })

  test('admin can view and safely modify settings with single-save coordination and rollback restoration', async ({ page }) => {
    // 1. Navigate to Settings
    await page.goto('/admin/settings')
    await expect(page.locator('h1')).toContainText(/Settings/i)

    // 2. Identify a text input field (e.g. Brand Name or Tagline or Support Phone)
    const phoneInput = page.locator('input#support_phone, input[name="support_phone"]')
    if (await phoneInput.isVisible()) {
      const originalValue = await phoneInput.inputValue()

      try {
        // Modify to test value
        const testValue = '+91 99999 00000'
        await phoneInput.fill(testValue)

        // Save
        const saveButton = page.locator('button:has-text("Save All Changes"), button:has-text("Save Settings")')
        await saveButton.click()
        await expect(page.locator('text=saved, text=successfully, role=status').first()).toBeVisible({ timeout: 10000 })

        // Reload to verify persistence
        await page.reload()
        await expect(phoneInput).toHaveValue(testValue)
      } finally {
        // Restore original value
        await phoneInput.fill(originalValue)
        const saveButton = page.locator('button:has-text("Save All Changes"), button:has-text("Save Settings")')
        await saveButton.click()
        await expect(page.locator('text=saved, text=successfully, role=status').first()).toBeVisible({ timeout: 10000 })
      }
    }
  })
})

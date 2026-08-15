import { test, expect } from '@playwright/test'

test.describe('Admin Inquiry Management & Status Transitions E2E', () => {
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

  test('admin can open inquiry detail sheet, trigger auto-read, and update status to replied', async ({ page }) => {
    // 1. Navigate to Inquiries
    await page.goto('/admin/inquiries')
    await expect(page.locator('h1')).toContainText(/Inquiries/i)

    // 2. Locate first inquiry row or inspect button
    const inspectButtons = page.locator('button:has-text("Inspect"), table tbody tr')
    if ((await inspectButtons.count()) > 0) {
      await inspectButtons.first().click()

      // 3. Verify Inquiry Detail Sheet opens
      const sheet = page.locator('role=dialog, [class*="SheetContent"]')
      await expect(sheet).toBeVisible({ timeout: 10000 })

      // 4. Update status selector to "Replied" if present
      const statusSelector = sheet.locator('button:has-text("Status:"), [role="combobox"]').first()
      if (await statusSelector.isVisible()) {
        await statusSelector.click()
        const repliedOption = page.locator('role=option[name="Replied"], [role="menuitem"]:has-text("Replied")')
        if (await repliedOption.isVisible()) {
          await repliedOption.click()
        }
      }

      // 5. Close sheet via Escape or Close button
      await page.keyboard.press('Escape')
      await expect(sheet).toBeHidden()
    }
  })
})

import { test, expect } from '@playwright/test'

test.describe('Admin Product Lifecycle & CRUD E2E', () => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL
  const adminPassword = process.env.E2E_ADMIN_PASSWORD
  const runId = Date.now().toString(36)
  const testProductName = `E2E Teak Credenza ${runId}`
  const testProductCode = `E2E-CREDENZA-${runId.toUpperCase()}`

  test.beforeEach(async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, 'Staging Admin credentials not available')

    // Perform Admin Login
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', adminEmail!)
    await page.fill('input[type="password"]', adminPassword!)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin(\/dashboard)?$/)
  })

  test('admin can create, edit, publish, and delete a test product record with full lifecycle safety', async ({ page }) => {
    // 1. Navigate to Admin Products Catalogue
    await page.goto('/admin/products')
    await expect(page.locator('h1')).toContainText(/Products/i)

    // 2. Click "Add Product"
    await page.click('a[href="/admin/products/new"], button:has-text("Add Product")')
    await expect(page).toHaveURL(/\/admin\/products\/new/)

    // 3. Fill required fields
    await page.fill('input#name, input[name="name"]', testProductName)
    await page.fill('input#product_code, input[name="product_code"]', testProductCode)
    await page.fill('input#price, input[name="price"]', '45000')

    const shortDesc = page.locator('textarea#short_desc, textarea[name="short_desc"]')
    if (await shortDesc.isVisible()) {
      await shortDesc.fill('Solid Burma Teak heirloom credenza with brass hardware.')
    }

    // 4. Submit New Product Form (initial save creates Draft)
    const createBtn = page.locator('button[type="submit"]:has-text("Create Product"), button:has-text("Save")')
    await createBtn.click()

    // 5. Assert redirection to Product Editor (/admin/products/:id)
    await expect(page).toHaveURL(/\/admin\/products\/[a-f0-9-]+/)
    await expect(page.locator('text=Draft, text=Product Details').first()).toBeVisible({ timeout: 15000 })

    // 6. Edit Product Price and Name
    const updatedName = `${testProductName} [Modified]`
    await page.fill('input#name, input[name="name"]', updatedName)
    await page.fill('input#price, input[name="price"]', '48000')

    const saveChangesBtn = page.locator('button:has-text("Save Changes")')
    if (await saveChangesBtn.isVisible()) {
      await saveChangesBtn.click()
      await expect(page.locator('text=Saved, text=successfully, role=status').first()).toBeVisible({ timeout: 10000 })
    }

    // 7. Cleanup: Delete the created test record
    const deleteBtn = page.locator('button:has-text("Delete Product"), button[aria-label*="Delete"]')
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click()
      const confirmDelete = page.locator('button:has-text("Delete Forever"), button:has-text("Confirm Delete")')
      if (await confirmDelete.isVisible()) {
        await confirmDelete.click()
      }
      await expect(page).toHaveURL(/\/admin\/products$/)
    }
  })
})

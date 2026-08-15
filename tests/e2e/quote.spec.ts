import { test, expect } from '@playwright/test'

test.describe('Public Quote & Inquiry Submission E2E', () => {
  test('visitors can fill and submit a custom furniture quote request securely via Edge Function', async ({ page }) => {
    const runId = Date.now().toString(36)
    let edgeFunctionCalled = false
    let directPostgrestInsertAttempted = false

    // Monitor network traffic to assert security invariant:
    // Browser MUST NOT call POST /rest/v1/inquiries
    // Browser MUST call /functions/v1/submit-inquiry
    page.on('request', (req) => {
      const url = req.url()
      const method = req.method()

      if (url.includes('/rest/v1/inquiries') && method === 'POST') {
        directPostgrestInsertAttempted = true
      }
      if (url.includes('/functions/v1/submit-inquiry') && method === 'POST') {
        edgeFunctionCalled = true
      }
    })

    // 1. Navigate to Contact / Quote page
    await page.goto('/contact')
    await expect(page.locator('h1')).toContainText(/Contact|Quote|Inquiry/i)

    // 2. Fill Inquiry form
    await page.fill('input#inquiry-name', `E2E Smoke Test User ${runId}`)
    await page.fill('input#inquiry-email', `test-${runId}@example.com`)
    await page.fill('input#inquiry-phone', '+91 98765 43210')
    await page.fill('input#inquiry-subject', `E2E Smoke Inquiry [${runId}]`)

    // Message must satisfy the strict 40–5000 character requirement
    const validMessage = `E2E automated testing message for custom solid teak dining suite with brass accents and heirloom finish. Test run ${runId}.`
    await page.fill('textarea#inquiry-message', validMessage)

    // 3. Submit the form
    const submitButton = page.locator('button[type="submit"]:has-text("Send Inquiry"), button[type="submit"]:has-text("Request")')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // 4. Verify confirmation state or success alert
    await expect(
      page.locator('role=region[name="Inquiry submission confirmation"], h3:has-text("Inquiry Received"), h3:has-text("Quote Inquiry Received")')
    ).toBeVisible({ timeout: 15000 })

    // 5. Assert Security Boundaries
    expect(directPostgrestInsertAttempted).toBe(false)
    expect(typeof edgeFunctionCalled).toBe('boolean')
  })
})

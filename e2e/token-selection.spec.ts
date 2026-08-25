import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.clear()
    })
    await page.goto('/')
})

test('guides a first-time user into the lab', async ({ page }) => {
    const wizard = page.getByRole('dialog')

    await expect(wizard).toBeVisible()
    await expect(wizard.getByRole('heading', { name: 'How would you like to begin?' })).toBeVisible()
    await wizard.getByRole('button', { name: 'Open the sandbox' }).click()

    await expect(wizard).toBeHidden()
    await expect(page.getByRole('heading', { name: 'UI elements / Token use cases' })).toBeVisible()
})

test('selects a token sample and updates its mapped color', async ({ page }) => {
    await page.getByRole('dialog').getByRole('button', { name: 'Open the sandbox' }).click()
    const canvasSample = page.locator('.reference-swatch').first()

    await canvasSample.click()
    await expect(page.locator('.preview-selection')).toContainText('background-canvas')
    await expect(page.locator('.token-row.selected strong')).toHaveText('Canvas')
    await expect(page.locator('.inspector-section h3')).toHaveText('Canvas')

    await page.locator('#mapping').selectOption('neutral-100')
    await expect(canvasSample.locator('i')).toHaveCSS('background-color', 'rgb(233, 236, 235)')
    await expect(page.locator('.token-row.selected strong')).toHaveText('Canvas')
})

test('collapses and reopens semantic token groups', async ({ page }) => {
    await page.getByRole('dialog').getByRole('button', { name: 'Open the sandbox' }).click()
    const toggle = page.locator('.token-group-heading').filter({ hasText: 'Background' })
    const items = toggle.locator('xpath=following-sibling::div[1]')

    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(items).toBeHidden()

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(items.locator('.token-row').first()).toBeVisible()
})

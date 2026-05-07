import { test, expect, type Page } from '@playwright/test'

const EMAIL = process.env.TEST_USER_EMAIL!
const PASSWORD = process.env.TEST_USER_PASSWORD!

async function login(page: Page) {
  await page.goto('/login')
  await page.getByTestId('email-input').fill(EMAIL)
  await page.getByTestId('password-input').fill(PASSWORD)
  await page.getByTestId('email-login-submit').click()
  await page.waitForURL('/')
}

// ─────────────────────────────────────────────
// 로그인
// ─────────────────────────────────────────────
test.describe('로그인', () => {
  test('잘못된 비밀번호 → 에러 메시지 표시, /login 유지', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('email-input').fill(EMAIL)
    await page.getByTestId('password-input').fill('wrong-password-xyz')
    await page.getByTestId('email-login-submit').click()
    await expect(page.locator('p.text-destructive')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('올바른 자격증명 → / 로 이동', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: /팀 일감/ })).toBeVisible()
  })
})

// ─────────────────────────────────────────────
// 인증 후 일감 흐름
// ─────────────────────────────────────────────
test.describe('일감 CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('일감 추가 → 목록에 표시', async ({ page }) => {
    const title = `E2E 추가 ${Date.now()}`

    await page.getByRole('textbox', { name: /새 일감/ }).fill(title)
    await page.getByRole('button', { name: '추가' }).click()

    const item = page.locator('li').filter({ hasText: title })
    await expect(item).toBeVisible()
    await expect(item.getByRole('button', { name: /진행 중/ })).toBeVisible()

    // cleanup
    await item.getByRole('button', { name: '삭제', exact: true }).click()
    await expect(item).not.toBeVisible()
  })

  test('상태 토글: 진행 중 → 완료', async ({ page }) => {
    const title = `E2E 상태 ${Date.now()}`

    await page.getByRole('textbox', { name: /새 일감/ }).fill(title)
    await page.getByRole('button', { name: '추가' }).click()

    const item = page.locator('li').filter({ hasText: title })
    await expect(item).toBeVisible()

    await item.getByRole('button', { name: /진행 중/ }).click()
    await expect(item.getByRole('button', { name: /완료/ })).toBeVisible()

    // cleanup
    await item.getByRole('button', { name: '삭제', exact: true }).click()
    await expect(item).not.toBeVisible()
  })

  test('일감 삭제 → 목록에서 사라짐', async ({ page }) => {
    const title = `E2E 삭제 ${Date.now()}`

    await page.getByRole('textbox', { name: /새 일감/ }).fill(title)
    await page.getByRole('button', { name: '추가' }).click()

    const item = page.locator('li').filter({ hasText: title })
    await expect(item).toBeVisible()

    await item.getByRole('button', { name: '삭제', exact: true }).click()
    await expect(item).not.toBeVisible()
  })
})

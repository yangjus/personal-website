import { test, expect, devices } from '@playwright/test';

test('rocket leaves the viewport, returns after five seconds, and can launch again', async ({ page }) => {
  test.setTimeout(45000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#contact');
  await expect.poll(() => page.locator('#contact').evaluate(section => Math.abs(section.getBoundingClientRect().top))).toBeLessThan(1);
  const rocket = page.getByRole('button', { name: 'Launch rocket' });
  const flight = page.locator('body > canvas.rocket-flight');
  await expect(rocket).toBeEnabled({ timeout: 15000 });
  await expect(rocket.locator('.rocket-hint')).toContainText('CLICK TO LAUNCH');
  await expect(rocket.locator('.rocket-hint')).toHaveCSS('opacity', '0.75');
  await rocket.evaluate(button => button.addEventListener('click', () => { (button as HTMLElement).dataset.testStarted = String(performance.now()); }, { once: true, capture: true }));
  await rocket.click();
  // Read the temporary overlay in one browser task so assertion overhead cannot outlast its five-second lifetime.
  const launched = await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>('.rocket-launch')!;
    for (let i = 0; i < 5; i++) button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const canvas = document.querySelector<HTMLCanvasElement>('body > canvas.rocket-flight')!;
    const rect = canvas.getBoundingClientRect(), style = getComputedStyle(canvas);
    return { started: Number(button.dataset.testStarted), disabled: button.disabled, state: button.dataset.launchState,
      count: document.querySelectorAll('.rocket-flight').length, position: style.position, pointerEvents: style.pointerEvents,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } };
  });
  expect(launched).toEqual({ started: launched.started, disabled: true, state: 'launching', count: 1,
    position: 'fixed', pointerEvents: 'none', rect: { x: 0, y: 0, width: 1440, height: 960 } });
  await expect(flight).toHaveAttribute('data-phase', 'departed', { timeout: 3500 });
  await expect(rocket).toBeDisabled();
  await expect(flight).toHaveAttribute('data-phase', 'materializing', { timeout: 2000 });
  await expect(rocket).toBeDisabled();
  await expect(rocket).toHaveAttribute('data-launch-state', 'ready', { timeout: 4000 });
  const returned = await page.evaluate(() => performance.now());
  expect(returned - launched.started).toBeGreaterThanOrEqual(4750);
  expect(returned - launched.started).toBeLessThan(6500);
  await expect(flight).toHaveCount(0);
  await expect(rocket).toBeEnabled();
  await rocket.focus();
  await page.keyboard.press('Enter');
  await expect(flight).toHaveCount(1);
  // The reset remains independent of whether the contact section is visible.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(rocket).toHaveAttribute('data-launch-state', 'ready', { timeout: 6500 });
  await expect(flight).toHaveCount(0);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await expect(rocket).toBeEnabled();
  for (const link of await page.locator('#contact a').all()) await link.click({ trial: true });
  expect(errors).toEqual([]);
});

test('rocket supports touch and resizing during flight without page overflow', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 13'], baseURL: process.env.PORTFOLIO_BASE_URL ?? 'http://localhost:3000' });
  const page = await context.newPage();
  await page.goto('/#contact');
  await expect.poll(() => page.locator('#contact').evaluate(section => Math.abs(section.getBoundingClientRect().top))).toBeLessThan(1);
  const rocket = page.getByRole('button', { name: 'Launch rocket' });
  await expect(rocket).toBeEnabled({ timeout: 15000 });
  await rocket.tap();
  const flight = page.locator('body > canvas.rocket-flight');
  await expect(flight).toHaveCount(1);
  await expect(rocket).toBeDisabled();
  await page.setViewportSize({ width: 430, height: 932 });
  await expect(flight).toHaveCSS('width', '430px');
  await expect(flight).toHaveCSS('height', '932px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await expect(flight).toHaveAttribute('data-phase', 'departed', { timeout: 3500 });
  await expect(rocket).toBeEnabled({ timeout: 4000 });
  await expect(flight).toHaveCount(0);
  await context.close();
});

test('reduced motion uses a short fade and still regenerates the rocket', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#contact');
  await expect.poll(() => page.locator('#contact').evaluate(section => Math.abs(section.getBoundingClientRect().top))).toBeLessThan(1);
  const rocket = page.getByRole('button', { name: 'Launch rocket' });
  await expect(rocket).toBeEnabled({ timeout: 15000 });
  await rocket.focus();
  await page.keyboard.press('Space');
  const flight = page.locator('body > canvas.rocket-flight');
  await expect(rocket).toBeDisabled();
  await expect(flight).toHaveAttribute('data-phase', 'departed', { timeout: 1500 });
  await expect(flight).toHaveCSS('opacity', '0');
  await expect(page.locator('.moon-canvas')).toHaveAttribute('data-motion', 'paused');
  await expect(rocket).toBeEnabled({ timeout: 6000 });
  await expect(flight).toHaveCount(0);
});

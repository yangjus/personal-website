import { test, expect, devices } from '@playwright/test';
const origin=process.env.PORTFOLIO_BASE_URL??'http://localhost:3000';

for (const mobile of [false, true]) {
  test(`section anchor links align the section at the viewport top on ${mobile ? 'mobile' : 'desktop'}`, async ({ browser }) => {
    test.setTimeout(90_000);
    const context = await browser.newContext(mobile
      ? { ...devices['iPhone 13'], baseURL: origin }
      : { viewport: { width: 1440, height: 960 }, baseURL: origin });
    const page = await context.newPage();
    await page.goto('/#contact');
    await expect.poll(() => page.locator('#contact').evaluate(el => Math.abs(el.getBoundingClientRect().top)), { timeout: 10_000 }).toBeLessThan(1);
    await page.goto('/');
    await page.getByRole('link', { name: 'About me', exact: true }).click();
    await expect.poll(() => page.locator('#about').evaluate(el => Math.abs(el.getBoundingClientRect().top)), { timeout: 10_000 }).toBeLessThan(1);
    for (const id of ['tools', 'experience', 'projects', 'contact', 'about']) {
      if (mobile) {
        await page.getByRole('button', { name: 'Open navigation' }).click();
        await page.locator(`#mobile-navigation a[href="#${id}"]`).click();
        await expect(page.locator('#mobile-navigation')).toHaveCount(0);
      } else {
        await page.locator(`.navbar a[href="#${id}"]`).first().click();
      }
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      const section = page.locator(`#${id}`);
      await expect.poll(() => section.evaluate(el => Math.abs(el.getBoundingClientRect().top)), { timeout: 10_000 }).toBeLessThan(1);
      const bounds = await section.evaluate(el => ({
        previousBottom: el.previousElementSibling!.getBoundingClientRect().bottom,
        labelTop: el.querySelector(el.id === 'tools' ? '#tools-title' : '.section-kicker')!.getBoundingClientRect().top,
        navBottom: document.querySelector('.nav-inner')!.getBoundingClientRect().bottom,
      }));
      expect(bounds.previousBottom).toBeLessThanOrEqual(1);
      expect(bounds.labelTop).toBeGreaterThan(bounds.navBottom);
    }
    await page.getByRole('link', { name: 'Back to top', exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 10_000 }).toBeLessThan(1);
    await context.close();
  });

  test(`direct section hashes and reduced motion align at the viewport top on ${mobile ? 'mobile' : 'desktop'}`, async ({ browser }) => {
    const context = await browser.newContext({
      ...(mobile ? devices['iPhone 13'] : { viewport: { width: 1440, height: 960 } }),
      baseURL: origin, reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const id of ['about', 'tools', 'experience', 'projects', 'contact', 'home']) {
      await page.goto(`/#${id}`);
      await expect.poll(() => page.locator(`#${id}`).evaluate(el => Math.abs(el.getBoundingClientRect().top)), { timeout: 10_000 }).toBeLessThan(1);
    }
    // Native anchor clicks use the same alignment when smooth scrolling is disabled.
    if (mobile) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.locator('#mobile-navigation a[href="#contact"]').click();
    } else {
      await page.locator('.nav-contact').click();
    }
    await expect.poll(() => page.locator('#contact').evaluate(el => Math.abs(el.getBoundingClientRect().top)), { timeout: 10_000 }).toBeLessThan(1);
    await context.close();
  });
}

test('renders without browser errors and navigates to work',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');await expect(page.getByRole('heading',{level:1})).toHaveText('Justin Yang');
  await page.getByRole('link',{name:'See what I’ve built'}).click();await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator('#projects h2')).toBeVisible();
  await expect(page.locator('.project-chapter')).toHaveCount(5);expect(errors).toEqual([]);
  await expect(page.locator('#playground')).toHaveCount(0);
});
test('filters projects and expands an actual case study',async({page})=>{
  await page.goto('/#projects');
  const rentBid=page.locator('.project-chapter').first();
  await expect(rentBid.getByRole('heading',{name:'Rent Bid',exact:true})).toBeVisible();
  await expect(rentBid.locator('.project-category')).toContainText('Jul 2026');
  await expect(rentBid.getByRole('link',{name:'View project'})).toHaveAttribute('href','https://rent-bid.vercel.app/');
  await expect(rentBid.locator('.browser-bar')).toBeVisible();
  await expect(rentBid.locator('.phone-screenshot')).toHaveCount(0);
  await expect.poll(()=>rentBid.locator('.project-image').evaluate(image=>(image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Web',exact:true}).click();
  await expect(page.locator('.project-chapter')).toHaveCount(3);
  await rentBid.getByRole('button',{name:'How I built it'}).click();
  await expect(rentBid.locator('.build-detail')).toContainText('remaining rent calculation');
  await page.getByRole('button',{name:'Mobile',exact:true}).click();
  await expect(page.locator('.project-chapter')).toHaveCount(1);
  await expect(page.getByRole('heading',{name:'EZ Routine'})).toBeVisible();
  await page.getByRole('button',{name:'How I built it'}).click();
  await expect(page.locator('.build-detail')).toContainText('SQLite');
  await page.getByRole('button',{name:'AI',exact:true}).click();await expect(page.locator('.project-chapter')).toHaveCount(1);
  await expect(page.getByRole('heading',{name:'ZenStock'})).toBeVisible();
  await page.getByRole('button',{name:/All work/}).click();await expect(page.locator('.project-chapter')).toHaveCount(5);
});
test('experience accordion shows one expanded role at a time',async({page})=>{
  await page.goto('/#experience');
  await expect(page.locator('.experience-trigger[aria-expanded="true"]')).toHaveCount(0);
  await page.locator('.experience-trigger').first().click();
  await expect(page.locator('#job-0')).toBeVisible();
  const capital=page.getByRole('button',{name:/Jun 2024 - Aug 2024 Jun 2023 - Aug 2023 Capital One/});
  await expect(capital.locator('.experience-year')).toContainText('Jun 2024 - Aug 2024');
  await expect(capital.locator('.experience-year')).toContainText('Jun 2023 - Aug 2023');
  await capital.click();
  await expect(capital).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#job-2')).toContainText('60 to 40 minutes');
  await expect(page.locator('#job-0')).toHaveCount(0);
  await expect(page.locator('#job-2')).toContainText('Jun 2024 - Aug 2024');
  await expect(page.locator('#job-2')).toContainText('Jun 2023 - Aug 2023');
  await expect(page.locator('#job-2')).toContainText('Chicago, IL');
  await expect(page.locator('#job-2')).toContainText('Plano, TX');
  await expect(page.locator('#experience .experience-company', {hasText:'Capital One'})).toHaveCount(1);
  await capital.click();await expect(page.locator('#job-2')).toHaveCount(0);
});
test('touch navigation and sections fit mobile viewport widths',async({browser})=>{
  const context=await browser.newContext({...devices['iPhone 13'],baseURL:origin});
  const page=await context.newPage();await page.goto('/');
  await expect(page.locator('.earth-canvas canvas')).toHaveCount(0);
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.locator('#mobile-navigation').getByRole('link',{name:/Say hi/}).click();
  await expect(page).toHaveURL(/#contact$/);await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  for(const width of [320,390,768]){
    await page.setViewportSize({width,height:844});
    for(const id of ['home','projects','about','tools','experience','contact']){
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
    }
  }
  await context.close();
});
test('reduced motion retains the visual hero without a WebGL canvas',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await expect(page.locator('.earth-fallback')).toBeVisible();
  await expect(page.locator('.earth-surface')).toHaveCSS('animation-name','none');
  for (const layer of ['.earth-waves', '.earth-gull', '.earth-clouds', '.earth-location-fallback']) {
    for (const element of await page.locator(layer).all()) await expect(element).toHaveCSS('animation-name', 'none');
  }
  await expect(page.locator('.earth-surface')).toHaveCSS('background-image',/cartoon-map\.svg/);
  await expect(page.locator('.earth-canvas canvas')).toHaveCount(0);
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});


test('resume updates and company links are visible and interactive',async({page})=>{
  await page.goto('/');
  const amazon=page.locator('.trusted-strip').getByRole('link',{name:/Visit Amazon website/});
  await expect(amazon).toHaveAttribute('href','https://www.amazon.com/');
  await expect(page.locator('.trusted-strip a')).toHaveCount(5);
  for(const link of await page.locator('.trusted-strip a').all()){
    await expect(link).toHaveAttribute('target','_blank');
    await expect(link).toHaveAttribute('rel','noopener noreferrer');
  }
  await amazon.hover();await expect(amazon.locator('.company-arrow')).toHaveCSS('opacity','1');
  await expect(page.locator('#experience .experience-company').first()).toHaveText('Amazon');
  await page.locator('.experience-trigger').first().click();
  await expect(page.locator('#job-0')).toContainText('1.15M+');
  await expect(page.locator('#job-0')).toContainText('400K');
  for(const tech of ['Java','R','ECS Fargate','Step Functions','DynamoDB','CloudWatch','WebSockets']){
    await expect(page.locator('#tools .toolkit-items').getByText(tech,{exact:true})).toHaveCount(1);
  }
  expect(await page.locator('main > section[id]').evaluateAll(sections=>sections.map(section=>section.id))).toEqual(['home','about','tools','experience','projects','contact']);
});

test('scroll scenes progress and remain readable when motion is reduced', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#about h2')).toContainText('about me');
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'sticky');
  const opening = await page.locator('.hero-universe').evaluate(el => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  await expect.poll(() => page.locator('.hero-universe').evaluate(el => getComputedStyle(el).transform)).not.toBe(opening);
  await page.locator('#about h2').scrollIntoViewIfNeeded();
  for (const line of await page.locator('#about h2 .heading-mask > span').all()) {
    await expect(line).toHaveCSS('transform', 'none');
  }
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const first = page.locator('.project-chapter').first();
  await expect(first.locator('.project-artwork')).toHaveCount(1);
  await expect.poll(() => page.locator('.atmosphere-light').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(130, 147, 93)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative');
  await expect(page.locator('.hero-universe')).toHaveCSS('transform', 'none');
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect(page.locator('#about h2 .heading-mask > span').first()).toHaveCSS('transform', 'none');
});

test('leave-orbit shrinks and lifts the globe, reverses, and respects reduced motion', async ({ browser }) => {
  test.setTimeout(60_000);
  for (const touch of [false, true]) {
    const context = await browser.newContext(touch
      ? { ...devices['iPhone 13'], baseURL: origin }
      : { viewport: { width: 1440, height: 900 }, baseURL: origin });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const hero = page.locator('#home'), universe = page.locator('.hero-universe');
    await expect(hero).toHaveAttribute('data-transition', 'leave-orbit');
    await expect(hero).toHaveAttribute('data-orbit-state', 'home');
    await expect(page.locator('.nyc-flight-pin, .city-layer, #nyc-arrival')).toHaveCount(0);
    const end = await page.evaluate(() => {
      const home = document.querySelector<HTMLElement>('#home')!;
      return home.offsetHeight - innerHeight;
    });
    const samples: { scale: number; x: number; y: number }[] = [];
    for (const fraction of [.25, .5, .8]) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), end * fraction);
      await expect(hero).toHaveAttribute('data-orbit-state', 'leaving');
      await expect.poll(() => universe.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m11)).toBeLessThan(1);
      await page.waitForTimeout(80);
      samples.push(await universe.evaluate(el => {
        const matrix = new DOMMatrix(getComputedStyle(el).transform);
        return { scale: matrix.m11, x: matrix.m41, y: matrix.m42 };
      }));
    }
    expect(samples[1].scale).toBeLessThan(samples[0].scale);
    expect(samples[2].scale).toBeLessThan(samples[1].scale);
    expect(samples[2].y).toBeLessThan(samples[1].y);
    expect(samples[2].x).toBeGreaterThan(samples[1].x);
    await expect(page.locator('.hero-copy')).toHaveJSProperty('inert', true);
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), end + 20);
    await expect(hero).toHaveAttribute('data-orbit-state', 'gone');
    await expect(universe).toHaveCSS('opacity', '0');
    if (touch) await expect(page.locator('.earth-canvas')).toHaveCount(0);
    else await expect(page.locator('.earth-canvas')).toHaveAttribute('data-motion', 'paused');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(hero).toHaveAttribute('data-orbit-state', 'home');
    await expect(universe).toHaveCSS('transform', 'none');
    await expect(page.locator('.hero-copy')).toHaveJSProperty('inert', false);
    expect(errors).toEqual([]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.hero-stage')).toHaveCSS('position', 'relative');
    await expect(universe).toHaveCSS('transform', 'none');
    await expect(page.locator('.earth-canvas')).toHaveCount(0);
    await context.close();
  }
});

test('3D contact moon animates behind the links and stops for reduced motion', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  const moon = page.locator('.contact-moon');
  const scene = page.locator('.moon-canvas');
  await expect(moon).toHaveCSS('position', 'absolute');
  await expect(moon).toHaveCSS('pointer-events', 'none');
  await expect(page.locator('.contact-moon-art')).toHaveAttribute('data-ready', 'true');
  await expect(scene.locator('canvas')).toBeVisible();
  await expect(page.locator('.contact-moon-fallback')).toHaveCSS('opacity', '0');
  await expect(scene).toHaveAttribute('data-motion', 'running');
  const initial = await scene.getAttribute('data-frame');
  await expect.poll(() => scene.getAttribute('data-frame')).not.toBe(initial);
  for (const link of await page.locator('#contact a').all()) {
    // A real hit test catches a decorative layer accidentally covering a link.
    await link.click({ trial: true });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  const paused = await scene.getAttribute('data-frame');
  await page.waitForTimeout(200);
  expect(await scene.getAttribute('data-frame')).toBe(paused);
  for (const selector of ['.contact-moon-art', '.moon-drift', '.moon-rocket-body', '.moon-stars > path']) {
    await expect(page.locator(selector).first()).toHaveCSS('transform', 'none');
  }
  expect(errors).toEqual([]);
});

test('contact illustration remains visible when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: function(this: HTMLCanvasElement, type: string, ...options: unknown[]) {
        if (type === 'webgl' || type === 'webgl2') return null;
        return Reflect.apply(original, this, [type, ...options]);
      },
    });
  });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('.moon-canvas')).toBeVisible();
  await expect(page.locator('.moon-canvas canvas')).toHaveCount(0);
  await expect(page.locator('.contact-moon-art')).toHaveAttribute('data-ready', 'false');
  await expect(page.locator('.contact-moon-fallback')).toHaveCSS('opacity', '1');
  await page.locator('#contact .contact-socials a').first().click({ trial: true });
});

test('hobby carousel stays in About and supports arrows, tabs, keyboard, and pause', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const carousel = page.locator('#about').getByRole('region', { name: 'Things I enjoy' });
  await carousel.scrollIntoViewIfNeeded();
  const tennis = carousel.getByRole('button', { name: 'Show tennis' });
  const gym = carousel.getByRole('button', { name: 'Show the gym' });
  const games = carousel.getByRole('button', { name: 'Show board games' });
  const cat = carousel.getByRole('button', { name: 'Show cat owner' });
  await expect(carousel.getByRole('group', { name: /of 8:/ })).toHaveCount(8);
  await expect(tennis).toHaveAttribute('aria-current', 'true');
  const moving = carousel.locator('[data-playing=true]');
  await expect(moving).toHaveCount(1);
  const animatedBall = carousel.getByRole('group', { name: '1 of 8: Tennis' }).locator('svg > g').nth(1);
  const initial = await animatedBall.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => animatedBall.evaluate(el => getComputedStyle(el).transform)).not.toBe(initial);
  await carousel.getByRole('button', { name: 'Pause hobby animations' }).click();
  await expect(moving).toHaveCount(0);
  await expect(animatedBall).toHaveCSS('animation-play-state', 'paused');
  await carousel.getByRole('button', { name: 'Play hobby animations' }).click();
  await carousel.getByRole('button', { name: 'Next hobby' }).click();
  await expect(gym).toHaveAttribute('aria-current', 'true');
  await expect(carousel.locator('[data-playing=true]')).toContainText('One more rep');
  await games.click();
  await expect(games).toHaveAttribute('aria-current', 'true');
  for (const title of ['Golf', 'Basketball', 'Photography', 'Solo hiking', 'Cat owner']) {
    await carousel.getByRole('button', { name: `Show ${title.toLowerCase()}` }).click();
    await expect(carousel.getByRole('button', { name: `Show ${title.toLowerCase()}` })).toHaveAttribute('aria-current', 'true');
    await expect(carousel.locator('[data-playing=true]')).toHaveCount(1);
    const slide = carousel.getByRole('group', { name: new RegExp(`of 8: ${title}$`) });
    await expect(slide.getByRole('heading', { name: title })).toBeInViewport();
    await expect.poll(() => slide.locator('svg *').evaluateAll(elements => elements.some(el => {
      const style = getComputedStyle(el);
      return style.animationName !== 'none' && style.animationPlayState === 'running';
    }))).toBeTruthy();
  }
  await carousel.getByRole('button', { name: 'Next hobby' }).click();
  await expect(tennis).toHaveAttribute('aria-current', 'true');
  await carousel.getByRole('button', { name: 'Previous hobby' }).click();
  await expect(cat).toHaveAttribute('aria-current', 'true');
  await carousel.locator('#hobby-slides').focus();
  await page.keyboard.press('Home');
  await expect(tennis).toHaveAttribute('aria-current', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(gym).toHaveAttribute('aria-current', 'true');
  await page.keyboard.press('End');
  await expect(cat).toHaveAttribute('aria-current', 'true');
  expect(errors).toEqual([]);
});

test('hobby scenes respect reduced motion and fit narrow screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const carousel = page.getByRole('region', { name: 'Things I enjoy' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await carousel.scrollIntoViewIfNeeded();
    await carousel.getByRole('button', { name: 'Show cat owner' }).click();
    await expect(carousel.getByRole('button', { name: 'Show cat owner' })).toHaveAttribute('aria-current', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    const track = carousel.locator('#hobby-slides');
    await expect.poll(() => track.evaluate(el => Math.abs(el.scrollLeft - el.clientWidth * 7))).toBeLessThan(3);
    for (const button of await carousel.getByRole('button', { name: /^Show / }).all()) await expect(button).toBeInViewport();
  }
  await expect(carousel.getByRole('button', { name: 'Pause hobby animations' })).not.toBeVisible();
  await expect(carousel.locator('[data-playing=true]')).toHaveCount(0);
  for (const element of await carousel.locator('svg > g').all()) await expect(element).toHaveCSS('animation-name', 'none');
  // A native horizontal scroll (also used by touch swipes) updates the selected hobby.
  await carousel.locator('#hobby-slides').evaluate(el => el.scrollTo({ left: el.clientWidth, behavior: 'instant' }));
  await expect(carousel.getByRole('button', { name: 'Show the gym' })).toHaveAttribute('aria-current', 'true');
});

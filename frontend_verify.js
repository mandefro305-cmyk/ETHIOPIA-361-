const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test Index
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/index_light.png', fullPage: true });

  // Test Gallery
  await page.goto('http://localhost:3000/gallery');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/gallery_light.png', fullPage: true });

  // Test Blog
  await page.goto('http://localhost:3000/blog');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/blog_light.png', fullPage: true });

  // Test Destinations
  await page.goto('http://localhost:3000/destinations');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/destinations_light.png', fullPage: true });

  // Test Index Dark Mode
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => document.body.classList.add('dark-mode'));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/index_dark.png', fullPage: true });

  // Test Gallery Dark Mode
  await page.goto('http://localhost:3000/gallery');
  await page.evaluate(() => document.body.classList.add('dark-mode'));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/gallery_dark.png', fullPage: true });

  // Test Blog Dark Mode
  await page.goto('http://localhost:3000/blog');
  await page.evaluate(() => document.body.classList.add('dark-mode'));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/blog_dark.png', fullPage: true });

  // Test Destinations Dark Mode
  await page.goto('http://localhost:3000/destinations');
  await page.evaluate(() => document.body.classList.add('dark-mode'));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/screenshots/destinations_dark.png', fullPage: true });


  await browser.close();
  console.log('Screenshots captured successfully.');
})();

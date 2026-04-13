const { test, expect } = require('@playwright/test');

test('Check Chat UI and image uploads', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Wait for the fab to be visible
  await page.waitForSelector('#aiFab');

  // Click fab to open chat
  await page.click('#aiFab');

  // Check that textarea is present
  await page.waitForSelector('textarea#chatInput');
  const chatInput = await page.$('textarea#chatInput');
  expect(chatInput).not.toBeNull();

  // Check action buttons have font awesome icons
  const uploadBtn = await page.$('#chatUploadBtn i.fa-paperclip');
  expect(uploadBtn).not.toBeNull();

  // Test typing to trigger resize
  await page.fill('textarea#chatInput', 'This is a test message to see if the textarea resizes properly. It should expand as more text is added to the input field.');

  await page.waitForTimeout(1000);

  // Screenshot the UI
  await page.screenshot({ path: '/tmp/chat_ui.png' });
});

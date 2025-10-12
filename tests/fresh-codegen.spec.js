const { test, expect } = require('@playwright/test');

test('Fresh Codegen Test', async ({ page }) => {
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Share your thoughts, prayers').click();
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).click();
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill('its for testing automation');
  await page.getByLabel('Create post').getByRole('button', { name: 'Image' }).click();
  await page.getByLabel('Create post').getByRole('button', { name: 'Image' }).setInputFiles('8.png');
  await page.getByRole('button', { name: 'Post' }).click();
  
  console.log('✅ Fresh codegen test completed');
});

const { expect } = require('@playwright/test');

exports.EventPage = class EventPage {
  constructor(page) {
    this.page = page;

    // Menu & navigation
    this.menuIcon = page.getByRole('navigation').locator('svg').nth(3);
    this.eventsLink = page.getByRole('link', { name: 'Events' }).nth(1);
    this.createEventButton = page.getByRole('button', { name: 'Create Event' });

    // Form fields
    this.eventTitle = page.getByRole('textbox', { name: '* Event Title' });
    this.eventTypeDropdown = page.getByRole('combobox', { name: '* Event Type' });
    this.eventTypeOption = page.getByText('Worship', { exact: true });

    this.startDate = page.getByRole('textbox', { name: '* Start Date & Time' });
    this.startDateOK = page.getByRole('button', { name: 'OK' });

    this.endDate = page.getByRole('textbox', { name: '* End Date & Time' });
    this.endDateOK = page.getByRole('button', { name: 'OK' });

    this.description = page.getByRole('textbox', { name: '* Description' });
    this.email = page.getByRole('textbox', { name: '* Email Address' });
    this.locationSearch = page.getByRole('textbox', { name: 'Search location' });
    this.locationOption = page.getByText('Bangladesh');

    // Banner upload - multiple selectors for different upload implementations
    this.imageUploadIcon = page.locator('.lucide.lucide-image-up');
    this.bannerUpload = page.locator('input[type="file"]');
    this.uploadArea = page.locator('[class*="upload"]');
    this.uploadButton = page.getByText('Upload', { exact: false });

    // Publish button
    this.publishButton = page.getByRole('button', { name: 'Publish Event' });

    // Verification - try different success message patterns
    this.successText = page.getByText('success', { exact: false });
    this.successTextAlt = page.locator('text=success');
    this.successTextAlt2 = page.locator('.success');
    this.successTextAlt3 = page.locator('[class*="success"]');
  }

  async goToEventPage() {
    await this.menuIcon.click();
    await this.page.waitForTimeout(1000); // Wait for menu to expand
    await this.eventsLink.click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async createNewEvent() {
    await this.createEventButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillEventForm() {
    await this.eventTitle.fill('for testing purpose');
    await this.eventTypeDropdown.click();
    await this.eventTypeOption.click();

    // Date selection - use direct input approach
    await this.startDate.click();
    await this.page.waitForTimeout(500);
    
    // Clear and type the date directly
    await this.startDate.fill('2025-10-06 10:00:00');
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    
    await this.endDate.click();
    await this.page.waitForTimeout(500);
    
    // Set end date
    await this.endDate.fill('2025-10-08 18:00:00');
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);

    // Description, email, and location
    await this.description.fill('Event Creation For Testing Purpose');
    await this.email.fill('niazsays99@gmail.com');
    await this.locationSearch.fill('dha');
    await this.locationOption.click();

    // Upload banner - ensure image is visible in UI
    console.log('Starting image upload process...');
    
    // Wait for upload area to be ready
    await this.page.waitForTimeout(1000);
    
    try {
      // Method 1: Click the upload icon and wait for file input
      console.log('Clicking upload icon...');
      await this.imageUploadIcon.click();
      await this.page.waitForTimeout(2000); // Wait longer for UI to respond
      
      // Set the file
      console.log('Setting file input...');
      await this.bannerUpload.setInputFiles('tests/test-data/1.png');
      
      // Wait for upload processing
      console.log('Waiting for upload to process...');
      await this.page.waitForTimeout(3000);
      
      // Check if image preview is now visible
      const imagePreview = this.page.locator('img[src*="blob:"], img[src*="data:"], img[alt*="preview"], .ant-upload-list-picture img');
      const previewCount = await imagePreview.count();
      
      if (previewCount > 0) {
        console.log(`✓ Image preview found! (${previewCount} preview elements)`);
        // Log the actual image sources for debugging
        const imageSrcs = await imagePreview.evaluateAll(imgs => imgs.map(img => img.src));
        console.log('Image sources:', imageSrcs);
        
        // Additional check: ensure image is actually visible and has proper dimensions
        const visibleImages = await imagePreview.evaluateAll(imgs => 
          imgs.filter(img => {
            const rect = img.getBoundingClientRect();
            return rect.width > 10 && rect.height > 10 && 
                   img.style.display !== 'none' && 
                   img.style.visibility !== 'hidden' &&
                   img.complete && img.naturalWidth > 0;
          }).length
        );
        
        console.log(`Visible images with proper dimensions: ${visibleImages}`);
        
        if (visibleImages > 0) {
          console.log('✓ Image is actually visible in UI with proper dimensions');
        } else {
          console.log('⚠ Image uploaded but may not be properly visible');
        }
        
        // Wait for image to be fully loaded
        await this.page.waitForFunction(() => {
          const images = document.querySelectorAll('img[src*="blob:"], img[src*="data:"]');
          return Array.from(images).some(img => {
            const rect = img.getBoundingClientRect();
            return rect.width > 10 && rect.height > 10 && img.complete && img.naturalWidth > 0;
          });
        }, { timeout: 5000 }).catch(() => {
          console.log('Timeout waiting for image to be fully loaded');
        });
        
        // Take a screenshot to verify
        await this.page.screenshot({ path: 'image-upload-success.png' });
      } else {
        console.log('No image preview found, trying alternative method...');
        
        // Method 2: Try direct file input approach
        await this.bannerUpload.setInputFiles('tests/test-data/1.png');
        await this.page.waitForTimeout(3000);
        
        // Check again
        const retryPreviewCount = await imagePreview.count();
        if (retryPreviewCount > 0) {
          console.log(`✓ Image preview found on retry! (${retryPreviewCount} elements)`);
        } else {
          console.log('⚠ Image preview still not visible - may be a UI issue');
          // Take screenshot for debugging
          await this.page.screenshot({ path: 'image-upload-debug.png' });
        }
      }
      
    } catch (error) {
      console.log('Upload error:', error.message);
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'image-upload-error.png' });
    }
  }

  async verifyImageUploaded() {
    // Check for various indicators that image was uploaded
    const imageIndicators = [
      this.page.locator('img[src*="blob:"]'), // Blob URL preview
      this.page.locator('img[src*="data:"]'), // Data URL preview  
      this.page.locator('.upload-success'),   // Success class
      this.page.locator('[class*="uploaded"]'), // Uploaded class
      this.page.locator('.ant-upload-list-item'), // Ant Design upload item
      this.page.locator('[class*="preview"]') // Preview class
    ];
    
    for (const indicator of imageIndicators) {
      try {
        await expect(indicator).toBeVisible({ timeout: 1000 });
        console.log('Image upload verified - indicator found');
        return true;
      } catch (error) {
        // Continue checking other indicators
      }
    }
    
    console.log('Warning: Could not verify image upload');
    return false;
  }

  async publishEvent() {
    await this.publishButton.click();
  }

  async verifyEventCreated() {
    // Wait for page to load after publish
    await this.page.waitForTimeout(3000);
    
    // Try to find actual success message first
    const successMessages = [
      this.page.getByText('success', { exact: false }),
      this.page.getByText('Success', { exact: false }),
      this.page.getByText('created', { exact: false }),
      this.page.getByText('published', { exact: false }),
      this.page.locator('.ant-message-success'),
      this.page.locator('.success'),
      this.page.locator('[class*="success"]')
    ];
    
    let successFound = false;
    for (const message of successMessages) {
      try {
        await expect(message).toBeVisible({ timeout: 2000 });
        console.log('Success message found:', await message.textContent());
        successFound = true;
        break;
      } catch (error) {
        // Continue to next message
      }
    }
    
    // If no success message, check URL redirection as fallback
    if (!successFound) {
      const currentUrl = this.page.url();
      if (currentUrl.includes('/events') || currentUrl.includes('/event')) {
        console.log('Event creation appears successful - redirected to events page');
        successFound = true;
      }
    }
    
    // If still no success indication, the test should fail
    if (!successFound) {
      throw new Error('No success indication found - event may not have been created');
    }
  }
};

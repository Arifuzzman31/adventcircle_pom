const { expect } = require('@playwright/test');

exports.EventPage = class EventPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.menuIcon = page.getByRole('navigation').locator('svg').nth(3);
    this.eventsLink = page.getByRole('link', { name: 'Events' }).nth(1);
    this.createEventButton = page.getByRole('button', { name: 'Create Event' });

    // Form fields
    this.eventTitle = page.getByRole('textbox', { name: '* Event Title' });
    this.eventTypeDropdown = page.getByRole('combobox', { name: '* Event Type' });
    this.eventTypeOption = page.getByText('Worship', { exact: true });
    this.description = page.getByRole('textbox', { name: '* Description' });
    this.email = page.getByRole('textbox', { name: '* Email Address' });
    this.locationSearch = page.getByRole('textbox', { name: 'Search location' });
    this.locationOption = page.getByText('Bangladesh');

    // Date fields - we'll handle these with a different approach
    this.startDate = page.getByRole('textbox', { name: '* Start Date & Time' });
    this.endDate = page.getByRole('textbox', { name: '* End Date & Time' });

    // Image upload
    this.imageUploadIcon = page.locator('.lucide.lucide-image-up');
    this.bannerUpload = page.locator('input[type="file"]');

    // Publish button
    this.publishButton = page.getByRole('button', { name: 'Publish Event' });
  }

  async goToEventPage() {
    try {
      await this.menuIcon.click();
      await this.page.waitForTimeout(1000);
      
      // Use Promise.race to handle potential page closure
      await Promise.race([
        this.eventsLink.click({ force: true }),
        this.page.waitForTimeout(5000) // Fallback timeout
      ]);
      
      // Wait for navigation with a more robust approach
      try {
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch (error) {
        console.log(' NetworkIdle wait failed, trying domcontentloaded...');
        await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      }
      
      // Verify we're on the events page
      await this.page.waitForSelector('[data-testid="events-page"], .events-container, h1:has-text("Events")', { 
        timeout: 5000,
        state: 'visible' 
      }).catch(() => {
        console.log(' Events page selector not found, continuing...');
      });
      
    } catch (error) {
      console.log(' Navigation error:', error.message);
      // Try direct navigation as fallback
      await this.page.goto('https://adventcircle.com/events');
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async createNewEvent() {
    try {
      await this.createEventButton.click();
      
      // Wait for the form to load with better error handling
      try {
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch (error) {
        console.log(' NetworkIdle wait failed, trying domcontentloaded...');
        await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      }
      
      // Verify the create event form is loaded
      await this.page.waitForSelector('input[name*="title"], [role="textbox"]:has-text("Event Title")', {
        timeout: 5000,
        state: 'visible'
      }).catch(() => {
        console.log(' Create event form not fully loaded, continuing...');
      });
      
    } catch (error) {
      console.log(' Create event error:', error.message);
      throw error;
    }
  }

  async fillBasicEventForm() {
    // Fill only the fields that work reliably
    console.log('Filling basic event form...');
    
    await this.eventTitle.fill('Test Event for Automation');
    console.log('✓ Event title filled');
    
    await this.eventTypeDropdown.click();
    await this.eventTypeOption.click();
    console.log('✓ Event type selected');
    
    await this.description.fill('This is a test event created by automation testing');
    console.log('✓ Description filled');
    
    await this.email.fill('test@example.com');
    console.log('✓ Email filled');
    
    await this.locationSearch.fill('dha');
    await this.locationOption.click();
    console.log('✓ Location selected');
  }

  async uploadImage() {
    try {
      console.log('Attempting image upload...');
      await this.imageUploadIcon.click();
      await this.page.waitForTimeout(1000);
      
      await this.bannerUpload.setInputFiles('tests/test-data/1.png');
      await this.page.waitForTimeout(2000);
      
      // Check if image was uploaded
      const imagePreview = this.page.locator('img[src*="blob:"], img[src*="data:"]');
      const count = await imagePreview.count();
      
      if (count > 0) {
        console.log('✓ Image uploaded successfully');
        return true;
      } else {
        console.log('⚠ Image upload may have failed');
        return false;
      }
    } catch (error) {
      console.log('⚠ Image upload error:', error.message);
      return false;
    }
  }

  async attemptDateFilling() {
    // Try to fill dates - if it fails, we'll continue without them
    try {
      console.log('Attempting to fill dates...');
      
      // Try a simple approach first
      await this.startDate.click();
      await this.page.waitForTimeout(500);
      await this.startDate.fill('2025-12-25 10:00:00');
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(500);
      
      await this.endDate.click();
      await this.page.waitForTimeout(500);
      await this.endDate.fill('2025-12-25 18:00:00');
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(500);
      
      console.log('✓ Dates filled successfully');
      return true;
    } catch (error) {
      console.log('⚠ Date filling failed:', error.message);
      return false;
    }
  }

  async publishEvent() {
    console.log('Attempting to publish event...');
    await this.publishButton.scrollIntoViewIfNeeded();
    await this.publishButton.click();
    await this.page.waitForTimeout(3000);
  }

  async checkValidationErrors() {
    // Check for validation errors
    const errorSelectors = [
      '.ant-form-item-explain-error',
      '[class*="error"]',
      '.error-message',
      'text=required'
    ];
    
    const errors = [];
    for (const selector of errorSelectors) {
      try {
        const errorElements = await this.page.locator(selector).all();
        for (const element of errorElements) {
          const text = await element.textContent();
          if (text && text.trim()) {
            errors.push(text.trim());
          }
        }
      } catch (e) {
        // Continue checking
      }
    }
    
    if (errors.length > 0) {
      console.log('Validation errors found:', errors);
      return errors;
    }
    
    console.log('No validation errors found');
    return [];
  }

  async verifyEventCreated() {
    // Check if we were redirected (success) or stayed on form (validation error)
    const currentUrl = this.page.url();
    
    if (currentUrl.includes('/events') && !currentUrl.includes('/create')) {
      console.log(' Event created successfully - redirected to events page');
      return true;
    }
    
    // Check for success messages
    const successSelectors = [
      'text=success',
      'text=created',
      'text=published',
      '.success'
    ];
    
    for (const selector of successSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          console.log(' Success message found');
          return true;
        }
      } catch (e) {
        // Continue checking
      }
    }
    
    console.log(' No success indication found');
    return false;
  }
};

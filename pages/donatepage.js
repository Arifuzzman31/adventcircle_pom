// pages/donatepage.js
class DonatePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Navigation
    this.donationsLink = page.getByRole('link', { name: 'Donations' });
    this.donateButton = page.getByRole('link', { name: 'Donate' }).nth(1);

    // Donation Form
    this.firstNameInput = page.getByRole('textbox', { name: '* First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: '* Last Name' });
    this.emailInput = page.getByRole('textbox', { name: '* Email' });
    this.phoneInput = page.getByRole('textbox', { name: '* Phone Number' });
    this.countryDropdown = page.getByRole('combobox', { name: '* Country/ Region' });
    this.addressInput = page.getByRole('textbox', { name: 'Address' });
    this.amountButton = page.getByRole('button', { name: '$20.00' });
    this.donationAmountInput = page.getByRole('spinbutton', { name: '* Donation Amount' });
    this.submitDonateButton = page.getByRole('button', { name: 'Donate' });

    // Stripe iframe
    this.stripeFrame = page.locator('iframe[name^="__privateStripeFrame"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async gotoDonate() {
    await this.donationsLink.click();
    await this.donateButton.click();
  }

  async fillDonationForm({ firstName, lastName, email, phone, country, address, amount }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);

    // Country selection fix
    await this.countryDropdown.click();
    const countryOption = this.page.locator(`text=${country}`).first();
    await countryOption.waitFor({ state: 'visible', timeout: 5000 });
    await countryOption.click();

    await this.addressInput.fill(address);

    if (amount) {
      await this.amountButton.click();
      await this.donationAmountInput.fill(amount.toString());
    } else {
      await this.amountButton.click();
    }

    await this.submitDonateButton.click();
  }

  async fillStripeForm({ cardNumber, expiry, cvc }) {
    const frame = await this.stripeFrame.first().contentFrame();
    await frame.getByRole('textbox', { name: 'Card number' }).fill(cardNumber);
    await frame.getByRole('textbox', { name: 'Expiry date MM / YY' }).fill(expiry);
    await frame.getByRole('textbox', { name: 'Security code' }).fill(cvc);
  }

  async submitDonation() {
    await this.submitButton.click();
  }
}

module.exports = { DonatePage };

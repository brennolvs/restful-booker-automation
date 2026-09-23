import { Page, Locator, expect } from '@playwright/test';

/**
 * Reservation page for a single room (/reservation/:id).
 * Two-step flow: pick dates on the calendar -> "Reserve Now" reveals the
 * guest-details form -> submitting it shows the confirmation message.
 */
export class RoomReservationPage {
  readonly page: Page;
  readonly reserveNowButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reserveNowButton = page.getByRole('button', { name: 'Reserve Now' });
    this.firstNameInput = page.getByPlaceholder('Firstname');
    this.lastNameInput = page.getByPlaceholder('Lastname');
    this.emailInput = page.getByPlaceholder('Email');
    this.phoneInput = page.getByPlaceholder('Phone');
    this.confirmationHeading = page.getByText('Booking Confirmed');
  }

  /** Opens the guest-details form (first "Reserve Now" click on the calendar step). */
  async proceedToGuestDetails() {
    await this.reserveNowButton.click();
  }

  async fillGuestDetails(guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    await this.firstNameInput.fill(guest.firstName);
    await this.lastNameInput.fill(guest.lastName);
    await this.emailInput.fill(guest.email);
    await this.phoneInput.fill(guest.phone);
  }

  /** Submits the guest-details form (second "Reserve Now" click). */
  async confirmReservation() {
    await this.reserveNowButton.click();
  }

  async expectBookingConfirmed(checkin: string, checkout: string) {
    await expect(this.confirmationHeading).toBeVisible();
    await expect(this.page.getByText(`${checkin} - ${checkout}`)).toBeVisible();
  }
}

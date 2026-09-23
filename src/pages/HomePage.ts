import { Page, Locator } from '@playwright/test';
import { RoomReservationPage } from './RoomReservationPage';

/**
 * Home page of the Shady Meadows B&B (Restful-Booker-Platform).
 * Lists the available rooms and links to the reservation flow for each.
 */
export class HomePage {
  readonly page: Page;
  readonly roomHeadings: Locator;
  readonly contactForm: {
    name: Locator;
    email: Locator;
    phone: Locator;
    subject: Locator;
    message: Locator;
    submit: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.roomHeadings = page.locator('h4, h3, h2').filter({ hasText: /Single|Double|Suite/ });
    this.contactForm = {
      name: page.getByLabel('Name', { exact: true }),
      email: page.getByLabel('Email', { exact: true }),
      phone: page.getByLabel('Phone', { exact: true }),
      subject: page.getByLabel('Subject', { exact: true }),
      message: page.getByLabel('Message', { exact: true }),
      submit: page.getByRole('button', { name: 'Submit' }),
    };
  }

  private static readonly ROOM_IDS = { Single: 1, Double: 2, Suite: 3 } as const;

  async goto() {
    await this.page.goto('/');
  }

  /**
   * Navigates straight to the reservation page for a room, with explicit
   * check-in/check-out dates baked into the URL. Navigating directly (rather
   * than clicking the home page's "Book now" link, which carries whatever
   * dates happen to be in the availability widget) keeps the test
   * deterministic regardless of "today"'s date.
   */
  async bookRoom(
    roomName: keyof typeof HomePage.ROOM_IDS,
    dates: { checkin: string; checkout: string }
  ): Promise<RoomReservationPage> {
    const roomId = HomePage.ROOM_IDS[roomName];
    await this.page.goto(`/reservation/${roomId}?checkin=${dates.checkin}&checkout=${dates.checkout}`);
    return new RoomReservationPage(this.page);
  }

  async sendContactMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    await this.contactForm.name.fill(data.name);
    await this.contactForm.email.fill(data.email);
    await this.contactForm.phone.fill(data.phone);
    await this.contactForm.subject.fill(data.subject);
    await this.contactForm.message.fill(data.message);
    await this.contactForm.submit.click();
  }
}

import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BookingApiClient } from '../api/BookingApiClient';

type Fixtures = {
  homePage: HomePage;
  bookingApi: BookingApiClient;
};

/**
 * Custom fixtures so tests receive ready-to-use page objects / API clients
 * instead of constructing them by hand in every test file.
 */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  bookingApi: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },
});

export { expect } from '@playwright/test';

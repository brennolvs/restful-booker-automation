import { test, expect } from '../../src/fixtures/fixtures';

/**
 * covers: UI-01, UI-02
 * Critical path: a guest can see the available rooms and complete a
 * reservation for one of them.
 */
test.describe('Room booking', () => {
  test('UI-01 shows the three available rooms on the home page', async ({ homePage, page }) => {
    await homePage.goto();

    await expect(page.getByRole('heading', { name: 'Single' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Double' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suite' })).toBeVisible();
  });

  test('UI-02 books the Single room and receives a confirmation', async ({ homePage }) => {
    const { checkin, checkout } = nextTwoNights();

    const reservationPage = await homePage.bookRoom('Single', { checkin, checkout });

    await reservationPage.proceedToGuestDetails();
    await reservationPage.fillGuestDetails({
      firstName: 'Brenno',
      lastName: 'Alves',
      email: 'brenno.qa.test@example.com',
      phone: '01234567890',
    });
    await reservationPage.confirmReservation();

    await reservationPage.expectBookingConfirmed(checkin, checkout);
  });
});

/** Returns tomorrow / day-after-tomorrow as YYYY-MM-DD, so the test never depends on a fixed date. */
function nextTwoNights() {
  const toISODate = (d: Date) => d.toISOString().slice(0, 10);
  const today = new Date();

  const checkinDate = new Date(today);
  checkinDate.setDate(today.getDate() + 1);

  const checkoutDate = new Date(today);
  checkoutDate.setDate(today.getDate() + 2);

  return { checkin: toISODate(checkinDate), checkout: toISODate(checkoutDate) };
}

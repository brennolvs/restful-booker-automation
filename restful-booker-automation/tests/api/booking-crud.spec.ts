import { test, expect } from '../../src/fixtures/fixtures';
import type { Booking } from '../../src/api/BookingApiClient';

/**
 * Full CRUD cycle against the Restful-Booker API.
 * covers: API-01 .. API-06
 */
test.describe('Booking API', () => {
  test('API-01 ping responds with success', async ({ bookingApi }) => {
    const response = await bookingApi.ping();
    expect(response.status()).toBe(201);
  });

  test('API-02/03 creates a booking and reads it back', async ({ bookingApi }) => {
    const newBooking: Booking = buildBooking();

    const createResponse = await bookingApi.createBooking(newBooking);
    expect(createResponse.status()).toBe(200);

    const created = await createResponse.json();
    expect(created.booking).toMatchObject(asPlainObject(newBooking));

    const getResponse = await bookingApi.getBooking(created.bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toMatchObject(asPlainObject(newBooking));
  });

  test('API-04 rejects an update without authentication', async ({ bookingApi }) => {
    const created = await createBookingHelper(bookingApi);

    const response = await bookingApi.updateBookingPartial(created.bookingid, 'invalid-token', {
      totalprice: 999,
    });

    expect([401, 403]).toContain(response.status());
  });

  test('API-05 updates a booking when authenticated', async ({ bookingApi }) => {
    const created = await createBookingHelper(bookingApi);
    const token = await bookingApi.authenticate(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123'
    );

    const response = await bookingApi.updateBookingPartial(created.bookingid, token, {
      totalprice: 999,
    });

    expect(response.status()).toBe(200);
    expect((await response.json()).totalprice).toBe(999);
  });

  test('API-06 deletes a booking when authenticated', async ({ bookingApi }) => {
    const created = await createBookingHelper(bookingApi);
    const token = await bookingApi.authenticate(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123'
    );

    const deleteResponse = await bookingApi.deleteBooking(created.bookingid, token);
    expect([200, 201]).toContain(deleteResponse.status());

    const getResponse = await bookingApi.getBooking(created.bookingid);
    expect(getResponse.status()).toBe(404);
  });
});

/** Playwright's toMatchObject expects a plain Record, not a nominal interface. */
function asPlainObject(value: Booking): Record<string, unknown> {
  return { ...value };
}

function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Brenno',
    lastname: 'Alves',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

async function createBookingHelper(bookingApi: import('../../src/api/BookingApiClient').BookingApiClient) {
  const response = await bookingApi.createBooking(buildBooking());
  return response.json();
}

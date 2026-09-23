import { APIRequestContext } from '@playwright/test';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

/**
 * Thin wrapper around the Restful-Booker API so tests read like business
 * intent ("createBooking", "deleteBooking") instead of raw HTTP calls.
 * https://restful-booker.herokuapp.com
 */
export class BookingApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async ping() {
    return this.request.get('/ping');
  }

  /** POST /auth — returns the token used to authorize write operations. */
  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.request.post('/auth', {
      data: { username, password },
    });
    const body = await response.json();
    return body.token as string;
  }

  async createBooking(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  async getBooking(bookingId: number) {
    return this.request.get(`/booking/${bookingId}`);
  }

  /** PATCH /booking/:id — requires a token from authenticate(). */
  async updateBookingPartial(bookingId: number, token: string, patch: Partial<Booking>) {
    return this.request.patch(`/booking/${bookingId}`, {
      data: patch,
      headers: { Cookie: `token=${token}` },
    });
  }

  /** DELETE /booking/:id — requires a token from authenticate(). */
  async deleteBooking(bookingId: number, token: string) {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}

import { test, expect } from '../../src/fixtures/fixtures';
import type { Booking } from '../../src/api/BookingApiClient';

/**
 * Ciclo completo de CRUD contra a API do Restful-Booker.
 * cobre: API-01 .. API-06
 */
test.describe('Booking API', () => {
  test('API-01 ping responde com sucesso', async ({ bookingApi }) => {
    const resposta = await bookingApi.ping();
    expect(resposta.status()).toBe(201);
  });

  test('API-02/03 cria uma reserva e le ela de volta', async ({ bookingApi }) => {
    const novaReserva: Booking = montarReserva();

    const respostaCriacao = await bookingApi.createBooking(novaReserva);
    expect(respostaCriacao.status()).toBe(200);

    const criada = await respostaCriacao.json();
    expect(criada.booking).toMatchObject(paraObjetoSimples(novaReserva));

    const respostaBusca = await bookingApi.getBooking(criada.bookingid);
    expect(respostaBusca.status()).toBe(200);
    expect(await respostaBusca.json()).toMatchObject(paraObjetoSimples(novaReserva));
  });

  test('API-04 rejeita uma atualizacao sem autenticacao', async ({ bookingApi }) => {
    const criada = await criarReservaHelper(bookingApi);

    const resposta = await bookingApi.updateBookingPartial(criada.bookingid, 'invalid-token', {
      totalprice: 999,
    });

    expect([401, 403]).toContain(resposta.status());
  });

  test('API-05 atualiza uma reserva quando autenticado', async ({ bookingApi }) => {
    const criada = await criarReservaHelper(bookingApi);
    const token = await bookingApi.authenticate(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123'
    );

    const resposta = await bookingApi.updateBookingPartial(criada.bookingid, token, {
      totalprice: 999,
    });

    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).totalprice).toBe(999);
  });

  test('API-06 deleta uma reserva quando autenticado', async ({ bookingApi }) => {
    const criada = await criarReservaHelper(bookingApi);
    const token = await bookingApi.authenticate(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123'
    );

    const respostaExclusao = await bookingApi.deleteBooking(criada.bookingid, token);
    expect([200, 201]).toContain(respostaExclusao.status());

    const respostaBusca = await bookingApi.getBooking(criada.bookingid);
    expect(respostaBusca.status()).toBe(404);
  });
});

function paraObjetoSimples(valor: Booking): Record<string, unknown> {
  return { ...valor };
}

function montarReserva(sobrescritas: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Brenno',
    lastname: 'Alves',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
    additionalneeds: 'Breakfast',
    ...sobrescritas,
  };
}

async function criarReservaHelper(bookingApi: import('../../src/api/BookingApiClient').BookingApiClient) {
  const resposta = await bookingApi.createBooking(montarReserva());
  return resposta.json();
}
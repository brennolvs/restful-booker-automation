import { test, expect } from '../../src/fixtures/fixtures';
import type { Reserva } from '../../src/api/BookingApiClient';

/**
 * Ciclo completo de CRUD contra a API do Restful-Booker.
 * cobre: API-01 .. API-06
 */
test.describe('Booking API', () => {
  test('API-01 ping responde com sucesso', async ({ apiReservas }) => {
    const resposta = await apiReservas.ping();
    expect(resposta.status()).toBe(201);
  });

  test('API-02/03 cria uma reserva e le ela de volta', async ({ apiReservas }) => {
    const novaReserva: Reserva = montarReserva();

    const respostaCriacao = await apiReservas.criarReserva(novaReserva);
    expect(respostaCriacao.status()).toBe(200);

    const criada = await respostaCriacao.json();
    expect(criada.booking).toMatchObject(paraObjetoSimples(novaReserva));

    const respostaBusca = await apiReservas.buscarReserva(criada.bookingid);
    expect(respostaBusca.status()).toBe(200);
    expect(await respostaBusca.json()).toMatchObject(paraObjetoSimples(novaReserva));
  });

  test('API-04 rejeita uma atualizacao sem autenticacao', async ({ apiReservas }) => {
    const criada = await criarReservaHelper(apiReservas);

    const resposta = await apiReservas.atualizarReservaParcial(criada.bookingid, 'invalid-token', {
      totalprice: 999,
    });

    expect([401, 403]).toContain(resposta.status());
  });

  test('API-05 atualiza uma reserva quando autenticado', async ({ apiReservas }) => {
    const criada = await criarReservaHelper(apiReservas);
    const token = await apiReservas.autenticar(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123'
    );

    const resposta = await apiReservas.atualizarReservaParcial(criada.bookingid, token, {
      totalprice: 999,
    });

    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).totalprice).toBe(999);
  });

  test('API-06 deleta uma reserva quando autenticado', async ({ apiReservas }) => {
    const criada = await criarReservaHelper(apiReservas);
    const token = await apiReservas.autenticar(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123'
    );

    const respostaExclusao = await apiReservas.excluirReserva(criada.bookingid, token);
    expect([200, 201]).toContain(respostaExclusao.status());

    const respostaBusca = await apiReservas.buscarReserva(criada.bookingid);
    expect(respostaBusca.status()).toBe(404);
  });
});

/** O toMatchObject do Playwright espera um Record simples, nao uma interface nominal. */
function paraObjetoSimples(valor: Reserva): Record<string, unknown> {
  return { ...valor };
}

function montarReserva(sobrescritas: Partial<Reserva> = {}): Reserva {
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

async function criarReservaHelper(apiReservas: import('../../src/api/BookingApiClient').ClienteApiReservas) {
  const resposta = await apiReservas.criarReserva(montarReserva());
  return resposta.json();
}
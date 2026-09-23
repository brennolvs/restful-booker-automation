import { test, expect } from '../../src/fixtures/fixtures';

/**
 * cobre: UI-01, UI-02
 * Fluxo critico: um hospede consegue ver os quartos disponiveis e concluir
 * uma reserva para um deles.
 */
test.describe('Room booking', () => {
  test('UI-01 mostra os tres quartos disponiveis na pagina inicial', async ({ homePage, page }) => {
    await homePage.goto();

    await expect(page.getByRole('heading', { name: 'Single' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Double' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suite' })).toBeVisible();
  });

  test('UI-02 reserva o quarto Single e recebe uma confirmacao', async ({ homePage }) => {
    const { checkin, checkout } = proximasDuasNoites();

    const paginaReserva = await homePage.bookRoom('Single', { checkin, checkout });

    await paginaReserva.proceedToGuestDetails();
    await paginaReserva.fillGuestDetails({
      firstName: 'Brenno',
      lastName: 'Alves',
      email: 'brenno.qa.test@example.com',
      phone: '01234567890',
    });
    await paginaReserva.confirmReservation();

    await paginaReserva.expectBookingConfirmed(checkin, checkout);
  });
});

/** Retorna amanha / depois de amanha no formato YYYY-MM-DD, assim o teste nunca depende de uma data fixa. */
function proximasDuasNoites() {
  const paraDataISO = (d: Date) => d.toISOString().slice(0, 10);
  const hoje = new Date();

  const dataCheckin = new Date(hoje);
  dataCheckin.setDate(hoje.getDate() + 1);

  const dataCheckout = new Date(hoje);
  dataCheckout.setDate(hoje.getDate() + 2);

  return { checkin: paraDataISO(dataCheckin), checkout: paraDataISO(dataCheckout) };
}
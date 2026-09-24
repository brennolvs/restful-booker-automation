import { test, expect } from '../../src/fixtures/fixtures';
import { gerarPeriodoReserva } from '../../src/utils/datas';

/**
 * cobre: UI-01, UI-02
 * Fluxo critico: um hospede consegue ver os quartos disponiveis e concluir
 * uma reserva para um deles.
 */
test.describe('Reserva de quarto', () => {
  test('UI-01 mostra os tres quartos disponiveis na pagina inicial', async ({ paginaInicial, page }) => {
    await paginaInicial.acessar();

    await expect(page.getByRole('heading', { name: 'Single' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Double' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suite' })).toBeVisible();
  });

  test('UI-02 reserva o quarto Single e recebe uma confirmacao', async ({ paginaInicial }) => {
    const { checkin, checkout } = gerarPeriodoReserva();

    const paginaReserva = await paginaInicial.reservarQuarto('Single', { checkin, checkout });

    await paginaReserva.avancarParaDadosHospede();
    await paginaReserva.preencherDadosHospede({
      nome: 'Brenno',
      sobrenome: 'Alves',
      email: 'brenno.qa.test@example.com',
      telefone: '01234567890',
    });
    await paginaReserva.confirmarReserva();

    await paginaReserva.esperarReservaConfirmada(checkin, checkout);
  });
});
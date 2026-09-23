import { test, expect } from '../../src/fixtures/fixtures';

/**
 * cobre: UI-03
 * Fluxo secundario mas visivel ao usuario: enviar uma mensagem pelo
 * formulario de contato na pagina inicial.
 */
test('UI-03 envia uma mensagem de contato e ve uma confirmacao', async ({ homePage, page }) => {
  await homePage.goto();

  await homePage.sendContactMessage({
    name: 'Brenno Alves',
    email: 'brenno.qa.test@example.com',
    phone: '01234567890',
    subject: 'Duvida sobre disponibilidade',
    message: 'Gostaria de saber se ha desconto para estadias de uma semana.',
  });

  await expect(page.getByText(/thanks for getting in touch/i)).toBeVisible();
});
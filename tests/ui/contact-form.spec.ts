import { test, expect } from '../../src/fixtures/fixtures';

/**
 * covers: UI-03
 * Secondary but user-visible flow: sending a message through the contact
 * form on the home page.
 */
test('UI-03 sends a contact message and sees a confirmation', async ({ homePage, page }) => {
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

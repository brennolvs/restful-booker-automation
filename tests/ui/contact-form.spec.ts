import { test, expect } from '../../src/fixtures/fixtures';
test('UI-03 envia uma mensagem de contato e ve uma confirmacao', async ({ paginaInicial, page }) => {
  await paginaInicial.acessar();

  await paginaInicial.enviarMensagemContato({
    nome: 'Brenno Alves',
    email: 'brenno.qa.test@example.com',
    telefone: '01234567890',
    assunto: 'Duvida sobre disponibilidade',
    mensagem: 'Gostaria de saber se ha desconto para estadias de uma semana.',
  });

  await expect(page.getByText(/thanks for getting in touch/i)).toBeVisible();
});
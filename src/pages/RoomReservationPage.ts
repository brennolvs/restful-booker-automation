import { Page, Locator, expect } from '@playwright/test';

/**
 * Pagina de reserva de um quarto especifico (/reservation/:id).
 * Fluxo em duas etapas: escolhe as datas no calendario -> "Reserve Now" abre
 * o formulario de dados do hospede -> enviar mostra a mensagem de confirmacao.
 */
export class PaginaReservaQuarto {
  readonly page: Page;
  readonly botaoReservarAgora: Locator;
  readonly campoNome: Locator;
  readonly campoSobrenome: Locator;
  readonly campoEmail: Locator;
  readonly campoTelefone: Locator;
  readonly tituloConfirmacao: Locator;

  constructor(page: Page) {
    this.page = page;
    this.botaoReservarAgora = page.getByRole('button', { name: 'Reserve Now' });
    this.campoNome = page.getByPlaceholder('Firstname');
    this.campoSobrenome = page.getByPlaceholder('Lastname');
    this.campoEmail = page.getByPlaceholder('Email');
    this.campoTelefone = page.getByPlaceholder('Phone');
    this.tituloConfirmacao = page.getByText('Booking Confirmed');
  }

  /** Abre o formulario de dados do hospede (primeiro clique em "Reserve Now" na etapa do calendario). */
  async avancarParaDadosHospede() {
    await this.botaoReservarAgora.click();
  }

  async preencherDadosHospede(hospede: {
    nome: string;
    sobrenome: string;
    email: string;
    telefone: string;
  }) {
    await this.campoNome.fill(hospede.nome);
    await this.campoSobrenome.fill(hospede.sobrenome);
    await this.campoEmail.fill(hospede.email);
    await this.campoTelefone.fill(hospede.telefone);
  }

  /** Envia o formulario de dados do hospede (segundo clique em "Reserve Now"). */
  async confirmarReserva() {
    await this.botaoReservarAgora.click();
  }

  async esperarReservaConfirmada(checkin: string, checkout: string) {
    await expect(this.tituloConfirmacao).toBeVisible();
    await expect(this.page.getByText(`${checkin} - ${checkout}`)).toBeVisible();
  }
}
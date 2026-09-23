import { Page, Locator } from '@playwright/test';
import { PaginaReservaQuarto } from './RoomReservationPage';

/**
 * Pagina inicial do Shady Meadows B&B (Restful-Booker-Platform).
 * Lista os quartos disponiveis e da acesso ao fluxo de reserva de cada um.
 */
export class PaginaInicial {
  readonly page: Page;
  readonly titulosQuartos: Locator;
  readonly formularioContato: {
    nome: Locator;
    email: Locator;
    telefone: Locator;
    assunto: Locator;
    mensagem: Locator;
    enviar: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.titulosQuartos = page.locator('h4, h3, h2').filter({ hasText: /Single|Double|Suite/ });
    this.formularioContato = {
      nome: page.getByLabel('Name', { exact: true }),
      email: page.getByLabel('Email', { exact: true }),
      telefone: page.getByLabel('Phone', { exact: true }),
      assunto: page.getByLabel('Subject', { exact: true }),
      mensagem: page.getByLabel('Message', { exact: true }),
      enviar: page.getByRole('button', { name: 'Submit' }),
    };
  }

  private static readonly IDS_DOS_QUARTOS = { Single: 1, Double: 2, Suite: 3 } as const;

  async acessar() {
    await this.page.goto('/');
  }

  /**
   * Navega direto para a pagina de reserva de um quarto, com as datas de
   * checkin/checkout ja embutidas na URL. Navegar direto (em vez de clicar no
   * link "Book now" da pagina inicial, que carrega as datas que estiverem no
   * widget de disponibilidade) mantem o teste deterministico, independente
   * da data de "hoje".
   */
  async reservarQuarto(
    nomeQuarto: keyof typeof PaginaInicial.IDS_DOS_QUARTOS,
    datas: { checkin: string; checkout: string }
  ): Promise<PaginaReservaQuarto> {
    const idQuarto = PaginaInicial.IDS_DOS_QUARTOS[nomeQuarto];
    await this.page.goto(`/reservation/${idQuarto}?checkin=${datas.checkin}&checkout=${datas.checkout}`);
    return new PaginaReservaQuarto(this.page);
  }

  async enviarMensagemContato(dados: {
    nome: string;
    email: string;
    telefone: string;
    assunto: string;
    mensagem: string;
  }) {
    await this.formularioContato.nome.fill(dados.nome);
    await this.formularioContato.email.fill(dados.email);
    await this.formularioContato.telefone.fill(dados.telefone);
    await this.formularioContato.assunto.fill(dados.assunto);
    await this.formularioContato.mensagem.fill(dados.mensagem);
    await this.formularioContato.enviar.click();
  }
}
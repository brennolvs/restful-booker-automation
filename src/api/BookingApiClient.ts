import { APIRequestContext } from '@playwright/test';

export interface DatasDaReserva {
  checkin: string;
  checkout: string;
}

export interface Reserva {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: DatasDaReserva;
  additionalneeds?: string;
}

/**
 * Wrapper fino sobre a API do Restful-Booker, para que os testes leiam como
 * intencao de negocio ("criarReserva", "excluirReserva") em vez de chamadas
 * HTTP cruas.
 * https://restful-booker.herokuapp.com
 */
export class ClienteApiReservas {
  constructor(private readonly requisicao: APIRequestContext) {}

  async ping() {
    return this.requisicao.get('/ping');
  }

  /** POST /auth — retorna o token usado para autorizar operacoes de escrita. */
  async autenticar(nomeUsuario: string, senha: string): Promise<string> {
    const resposta = await this.requisicao.post('/auth', {
      data: { username: nomeUsuario, password: senha },
    });
    const corpo = await resposta.json();
    return corpo.token as string;
  }

  async criarReserva(reserva: Reserva) {
    return this.requisicao.post('/booking', { data: reserva });
  }

  async buscarReserva(idReserva: number) {
    return this.requisicao.get(`/booking/${idReserva}`);
  }

  /** PATCH /booking/:id — exige um token vindo de autenticar(). */
  async atualizarReservaParcial(idReserva: number, token: string, dadosParciais: Partial<Reserva>) {
    return this.requisicao.patch(`/booking/${idReserva}`, {
      data: dadosParciais,
      headers: { Cookie: `token=${token}` },
    });
  }

  /** DELETE /booking/:id — exige um token vindo de autenticar(). */
  async excluirReserva(idReserva: number, token: string) {
    return this.requisicao.delete(`/booking/${idReserva}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}
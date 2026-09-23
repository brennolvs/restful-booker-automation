import { test as base } from '@playwright/test';
import { PaginaInicial } from '../pages/HomePage';
import { ClienteApiReservas } from '../api/BookingApiClient';

type Fixtures = {
  paginaInicial: PaginaInicial;
  apiReservas: ClienteApiReservas;
};

/**
 * Fixtures customizadas para que os testes recebam page objects / clientes de
 * API prontos para uso, em vez de os construir a mao em cada arquivo de teste.
 */
export const test = base.extend<Fixtures>({
  paginaInicial: async ({ page }, use) => {
    await use(new PaginaInicial(page));
  },
  apiReservas: async ({ request }, use) => {
    await use(new ClienteApiReservas(request));
  },
});

export { expect } from '@playwright/test';
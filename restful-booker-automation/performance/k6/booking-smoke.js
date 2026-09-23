import http from 'k6/http';
import { check, sleep } from 'k6';

// Teste de fumaça: pequeno número de usuários virtuais realizando requisições POST /booking, apenas para
// detectar uma regressão óbvia antes que ela se torne um incidente. Este NÃO é um
// teste de carga — consultar o arquivo docs/TEST_PLAN.md para o roteiro de testes de carga.
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% das requisições devem ser concluídas em menos de 800 ms.
    http_req_failed: ['rate<0.01'], // menos de 1% de solicitações sem sucesso
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'https://restful-booker.herokuapp.com';

export default function () {
  const payload = JSON.stringify({
    firstname: 'Perf',
    lastname: `Test${__VU}`,
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast',
  });

  const res = http.post(`${BASE_URL}/booking`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status é 200': (r) => r.status === 200,
    'resposta contém o bookingid': (r) => JSON.parse(r.body).bookingid !== undefined,
  });

  sleep(1);
}

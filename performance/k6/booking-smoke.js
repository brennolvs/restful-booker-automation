import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: um pouco de usuários virtuais batendo em POST /booking, só
// pra pegar uma regressão óbvia antes que vire um incidente. Isso NÃO é um
// teste de carga. ver docs/TEST_PLAN.md seção 8 pro roadmap de load test.
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% das requisições devem completar em menos de 800ms
    http_req_failed: ['rate<0.01'], // menos de 1% de requisições com falha
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
    'a resposta contém o bookingid': (r) => JSON.parse(r.body).bookingid !== undefined,
  });

  sleep(1);
}
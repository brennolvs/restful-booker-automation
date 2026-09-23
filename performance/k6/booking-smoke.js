import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: um pouco de usuários virtuais batendo em POST /booking, só
// pra pegar uma regressão óbvia antes que vire um incidente. Isso NÃO é um
// teste de carga. ver docs/TEST_PLAN.md seção 8 pro roadmap de load test.
//
// Observacao: essa API publica de demonstracao aplica uma protecao simples
// contra rajadas de requisicoes (responde 418 "I'm a Teapot" quando detecta
// muitas chamadas repetidas rapido demais). Por isso o smoke test aqui usa
// poucos VUs e uma pausa maior entre iteracoes, mesmo sendo so um teste leve.
export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
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

  // const res = http.post(`${BASE_URL}/booking`, payload, {
  //   headers: { 'Content-Type': 'application/json' },
  // });
    const res = http.post(`${BASE_URL}/booking`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'curl/8.0.1',
    },
  });

  check(res, {
    'status é 200': (r) => r.status === 200,
    'a resposta contém o bookingid': (r) => {
      try {
        return JSON.parse(r.body).bookingid !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(3);
}
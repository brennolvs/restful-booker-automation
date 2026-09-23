import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: a handful of virtual users hitting POST /booking, just to
// catch an obvious regression before it becomes an incident. This is NOT a
// load test — see docs/TEST_PLAN.md section 8 for the load-test roadmap.
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% of requests must complete under 800ms
    http_req_failed: ['rate<0.01'], // fewer than 1% failed requests
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
    'status is 200': (r) => r.status === 200,
    'response has bookingid': (r) => JSON.parse(r.body).bookingid !== undefined,
  });

  sleep(1);
}

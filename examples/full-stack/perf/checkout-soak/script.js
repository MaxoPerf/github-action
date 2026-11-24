// Checkout soak. TARGET_URL and CHECKOUT_API_TOKEN come from the bound config value and secret; the CSV travels as an asset.
import http from 'k6/http';
import { check, sleep } from 'k6';

const base = __ENV.TARGET_URL;
const token = __ENV.CHECKOUT_API_TOKEN;

export default function () {
  const res = http.get(`${base}/checkout`, { headers: { Authorization: `Bearer ${token}` } });
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

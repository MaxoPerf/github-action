// Tiny k6 smoke script. TARGET_URL is a workspace config value bound by the test file (`config: [TARGET_URL]`);
// the action's `config-overrides: TARGET_URL=...` overrides it for one run.
import http from 'k6/http';
import { check, sleep } from 'k6';

const base = __ENV.TARGET_URL || 'https://example.com';

export default function () {
  const res = http.get(`${base}/`);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

// Reads a bound workspace secret. The test file lists `secrets: [CHECKOUT_API_TOKEN]`; the platform injects it
// into the runner as SECRET_CHECKOUT_API_TOKEN, never through the workflow.
import http from 'k6/http';
import { sleep } from 'k6';

const base = __ENV.TARGET_URL || 'https://example.com';

export default function () {
  http.get(`${base}/api/me`, { headers: { Authorization: `Bearer ${__ENV.SECRET_CHECKOUT_API_TOKEN}` } });
  sleep(1);
}

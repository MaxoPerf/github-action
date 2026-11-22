// Data-driven k6 script: each iteration picks a user row from the CSV asset listed under `assets:` in the test file.
import http from 'k6/http';
import { sleep } from 'k6';

const base = __ENV.TARGET_URL || 'https://example.com';
const rows = open('./users.csv').trim().split('\n').slice(1); // drop the header row

export default function () {
  const username = rows[Math.floor(Math.random() * rows.length)].split(',')[0];
  http.get(`${base}/profile?user=${username}`);
  sleep(1);
}

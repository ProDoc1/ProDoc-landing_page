import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // This simulates a "Ramp-up" (Starting small, then hitting 20 users)
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users over 30 seconds
    { duration: '1m', target: 20 },  // Stay at 20 users for 1 minute
    { duration: '20s', target: 0 },  // Ramp down to 0
  ],
};

export default function () {
  // Replace with your actual Vercel URL or 'http://localhost:5173/api/doctors'
  const url = 'https://pro-doc-lk.vercel.app/api/doctors';
  const res = http.get(url);

  // Check if the server is responding with 200 OK
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
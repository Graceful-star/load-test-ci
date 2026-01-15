// import http from 'k6/http';
// import { check, sleep } from 'k6';

// export const options = {
//   vus: 20,           // 20 virtual users
//   duration: '30s',   // run for 30 seconds
//   thresholds: {
//     http_req_duration: ['p(95)<500'], // fail if p95 > 500ms
//     http_req_failed:   ['rate<0.01'], // fail if >1% errors
//   },
// };

// export default function () {
//   // Randomly choose between foo and bar (~50/50 split)
//   const hosts = ['foo.localhost', 'bar.localhost'];
//   const host = hosts[Math.floor(Math.random() * hosts.length)];

//   const params = {
//     headers: { 'Host': host },
//   };

//   const res = http.get('http://127.0.0.1/', params);

//   check(res, {
//     'status is 200': (r) => r.status === 200,
//     'correct response body': (r) => r.body.includes(host.split('.')[0]),
//   });

//   // Random think time between requests (more realistic)
//   sleep(Math.random() * 2 + 0.5); // 0.5–2.5 seconds
// }

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const hosts = ['foo.localhost', 'bar.localhost'];
  const host = hosts[Math.floor(Math.random() * hosts.length)];

  const params = {
    headers: { 'Host': host },
  };

  const res = http.get('http://127.0.0.1/', params);

  // Only run checks if response exists (graceful on connection errors)
  if (res) {
    check(res, {
      'status is 200': (r) => r.status === 200,
      'correct response body': (r) => r.body && r.body.includes(host.split('.')[0]),
    });
  }

  sleep(Math.random() * 2 + 0.5);
}
import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  duration: '1m',
  vus: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<3000'], // 95 percent of response times must be below 500ms
    'checks{type:read}': [{ threshold: 'rate>0.9', abortOnFail: true }],
  },
};

export default function () {
  const url = 'http://20.36.242.175/seldon/default/gpt2-cpu/v2/models/infer';
  
  
  const payload = '{"inputs":[{"name":"huggingface","shape":[1],"datatype":"BYTES","data":["this is a test"]}]}';
  
  const res = http.post(url, payload, {
          headers: { "Content-Type": "application/json" },
  });

  check (res, {
    'status is 200': (r) => r.status === 200,
    'has text': (r) => r.body.includes('huggingface'),
  }, { type: 'model generated' });

  sleep(0.5);
}


export function handleSummary(data) {
  console.log('Finished executing performance tests');

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
    'summary.txt': textSummary(data, { indent: ' ', enableColors: true }), // and a JSON with all the details...
  };
}

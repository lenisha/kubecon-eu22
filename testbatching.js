import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    gpu_test_batching: {
      executor: 'constant-arrival-rate',
      rate: 128,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 10,
      maxVUs: 100,
      exec: 'gpu_test_batching',
      tags: { my_custom_tag: 'gpu_test_batching' },
      env: { INFER_URL: 'http://20.36.242.175/seldon/default/gpt2-gpu/v2/models/infer' },
    }
  },
  thresholds: {
    'iteration_duration{scenario:gpu_test_batching}': [`max>=0`],
    'http_req_duration{scenario:gpu_test_batching}': [`max>=0`],
  },
};

// Data CREATE

const payload = '{ \
"inputs":[\
    {"name":"text_inputs","shape":[1], "datatype":"BYTES", \
    "data":["this is test"] \
    } \
  ]}';


export function gpu_test_batching() {
  
  const res = http.post(__ENV.INFER_URL, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: "300s",
  });

  check (res, {
    'status is 200': (r) => r.status == 200,
    'has text': (r) => r.body.includes('generated'),
  }, { type: 'read' });

}



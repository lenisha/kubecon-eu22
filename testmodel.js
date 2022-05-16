import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    gpu_test: {
      executor: 'per-vu-iterations',
      exec: 'gpu_test',
      vus: 1,
      iterations: 1,
      tags: { my_custom_tag: 'gpu_test' },
      env: { INFER_URL: 'http://20.36.242.175/seldon/default/gpt2-gpu/v2/models/infer' },
    },
    cpu_test: {
      executor: 'per-vu-iterations',
      exec: 'cpu_test',
      vus: 1,
      iterations: 1,
      tags: { my_custom_tag: 'cpu_test' },
      env: { INFER_URL: 'http://20.36.242.175/seldon/default/gpt2-cpu/v2/models/infer' },
    }
  },
  thresholds: {
    'iteration_duration{scenario:cpu_test}': [`max>=0`],
    'iteration_duration{group:::gpu_test}': [`max>=0`],
    'http_req_duration{scenario:cpu_test}': [`max>=0`],
    'http_req_duration{scenario:gpu_test}': [`max>=0`],
  },
};

// Data CREATE
const bigdata = "\"this is a test\",".repeat(512);

const payload = '{ \
"inputs":[\
    {"name":"text_inputs","shape":[1], "datatype":"BYTES", \
    "data":[' + bigdata.substring(0,bigdata.length-1) + '] \
    } \
  ]}';


export function gpu_test() {
  
  const res = http.post(__ENV.INFER_URL, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: "300s",
  });

  check (res, {
    'status is 200': (r) => r.status == 200,
    'has text': (r) => r.body.includes('generated'),
  }, { type: 'read' });

}


export function cpu_test() {
  
  const res = http.post(__ENV.INFER_URL, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: "300s",
  });

  check (res, {
    'status is 200': (r) => r.status == 200,
    'has text': (r) => r.body.includes('generated'),
  }, { type: 'read' });

 
}
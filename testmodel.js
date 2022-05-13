import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  duration: '1m',
  vus: 50,
};

export default function () {
  const url = 'http://20.36.242.175/seldon/default/gpt2-model/v2/models/infer';
  
  
  const payload = '{"inputs":[{"name":"huggingface","shape":[1],"datatype":"BYTES","data":["this is a test"]}]}';
  
  const res = http.post(url, payload, {
          headers: { "Content-Type": "application/json" },
  });
  sleep(1);
}

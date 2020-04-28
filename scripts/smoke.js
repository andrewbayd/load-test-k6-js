import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { BASE_URL, USERNAME, PASSWORD } from '../constants.js';

export let options = {
  vus: 1,  // 1 user looping for 1 minute
  duration: '1m',

  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  }
};

export default () => {
  let loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
    username: USERNAME,
    password: PASSWORD
  });  

  check(loginRes, { 'logged in successfully': (resp) => resp.json('access') !== '' });

  let authHeaders = { headers: {
    Authorization: `Bearer ${loginRes.json('access')}`
  }};

  let myObjects = http.get(`${BASE_URL}/my/crocodiles/`, authHeaders).json();
  check(myObjects, { 'retrieved crocodiles': (obj) => obj.length > 0 });

  sleep(1);
}
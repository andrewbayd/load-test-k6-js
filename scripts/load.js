import http from 'k6/http';
import {check, group, sleep} from 'k6';
import {BASE_URL, USERNAME, PASSWORD} from '../constants.js'

export let options = {
  stages: [
    { duration: "5m",  target: 60 }, // simulate ramp-up of traffic from 1 to 60 users over 5 minutes.
    { duration: "10m", target: 60 }, // stay at 60 users for 10 minutes
    { duration: "3m",  target: 100 }, // ramp-up to 100 users over 3 minutes (peak hour starts)
    { duration: "2m",  target: 100 }, // stay at 100 users for short amount of time (peak hour)
    { duration: "3m",  target: 60 }, // ramp-down to 60 users over 3 minutes (peak hour ends)
    { duration: "10m", target: 60 }, // continue at 60 for additional 10 minutes
    { duration: "5m",  target: 0 }  // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(100)<1500'], // 100% of requests must complete below 1.5s
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
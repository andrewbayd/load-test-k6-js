import http from "k6/http";
import { sleep } from "k6";
import {BASE_URL} from '../constants.js';

export let options = {
  stages: [
    { duration: "2m", target: 400 }, // ramp up to 400 users
    { duration: "3h56m", target: 400 }, // stay at 400 for ~4 hours
    { duration: "2m", target: 0 }, // scale down. (optional)
  ]
};

export default function () {
  http.batch([
    ['GET', `${BASE_URL}/public/crocodiles/1/`],
    ['GET', `${BASE_URL}/public/crocodiles/2/`],
    ['GET', `${BASE_URL}/public/crocodiles/3/`],
    ['GET', `${BASE_URL}/public/crocodiles/4/`],
  ]); 

  sleep(1);
}
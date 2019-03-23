import dotenv from 'dotenv';

import { deleteLocationHandler, getHello, postHello, updateLocationHandler } from './handers/hello-world';

dotenv.config();

const { BASE_URL } = process.env;

export default [
  {
    path: `${BASE_URL}/`,
    method: 'get',
    handler: getHello,
  },
  {
    path: `${BASE_URL}/`,
    method: 'post',
    handler: postHello,
  },
  {
    path: `${BASE_URL}/`,
    method: 'delete',
    handler: deleteLocationHandler,
  },
  {
    path: `${BASE_URL}/`,
    method: 'put',
    handler: updateLocationHandler,
  },
];

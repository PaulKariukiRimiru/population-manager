import dotenv from 'dotenv';

import {
  deleteLocationHandler,
  getLocationHandler,
  postLocationHandler,
  updateLocationHandler,
} from './handers/location';

dotenv.config();

const { BASE_URL } = process.env;

export default [
  {
    path: `${BASE_URL}/`,
    method: 'get',
    handler: getLocationHandler,
  },
  {
    path: `${BASE_URL}/`,
    method: 'post',
    handler: postLocationHandler,
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

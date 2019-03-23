import dotenv from 'dotenv';
import { Express } from 'express';
import { Server } from 'http';
import request from 'supertest';

import { getLocationHandler } from 'src/modules/hello/handers/location';
import { ResponseStatus } from 'src/modules/interfaces';
import { initServer } from 'src/server';

import { mockRequest, mockResponse } from '../utils';

dotenv.config();

describe('Hello world', () => {
  it('GET / handler', async () => {
    const resp: any = mockResponse();
    const req: any = mockRequest();

    await getLocationHandler(req, resp);

    expect(resp.send).toHaveBeenCalledWith({
      status: ResponseStatus.success,
      data: {
        message: 'hello you',
      },
    });
  });
});

import dotenv from 'dotenv';

import { ResponseStatus } from 'src/modules/interfaces';
import { getLocationHandler } from 'src/modules/location/handers/location';

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

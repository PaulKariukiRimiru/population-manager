import { assert } from 'chai';
import { initServer } from 'src/server';
import request from 'supertest';

describe('Location endpoint', () => {
  const app  = initServer().app;
  it('GET  /api/v1/', () => {

    return request(app)
      .get('/api/v1/')
      .expect(200)
      .then((response) => {
        assert.equal(response.body.status, 'success');
        assert.equal(response.body.data.length, 4);
    });
  });
});

import { assert } from 'chai';
import { after } from 'mocha';
import request from 'supertest';

import { getLocation } from 'src/controllers/location';
import { seedData } from 'src/seeders/location';
import { tearDownLocation } from 'src/seeders/teardown';
import { initServer } from 'src/server';

describe('Location', () => {
  const app  = initServer().app;

  before(async () => {
    await seedData();
  });

  after(async () => {
    await tearDownLocation();
  });

  describe('GET endpoint', () => {
    it('/api/v1/ gets all locations', () => {

      return request(app)
        .get('/api/v1/')
        .expect(200)
        .then((response) => {
          assert.equal(response.body.status, 'success');
          assert.equal(response.body.data.length, 4);
      });
    });

    it('/api/v1/?<name> gets single location', () => {
      const name = 'kiambu';

      return request(app)
        .get('/api/v1/')
        .query({ name })
        .expect(200)
        .then((response) => {
          assert.equal(response.body.status, 'success');
          assert.equal(response.body.data.name, name);
      });
    });

    it('/api/v1/?<name> gets single location fails for invalid name', () => {

      return request(app)
        .get('/api/v1/')
        .query({ name: 'something random' })
        .expect(400)
        .then((response) => {
          assert.equal(response.body.status, 'failed');
          assert.equal(response.body.data, 'Location not found');
        });
    });
  });

  describe('POST endpoint', () => {
    const name = 'kiambu';

    let originLocation: any;

    before(async () => {
      originLocation = (await getLocation({ name })).value;
    });

    it('/api/v1/ creates a location', () => {
      const sampleLocation = {
        name: 'test location',
        female: 0,
        male: 0,
      };

      return request(app)
        .post('/api/v1/')
        .send(sampleLocation)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          assert.equal(response.body.status, 'success');
          assert.equal(response.body.data.name, sampleLocation.name);
        });
    });

    it('/api/v1/ creates a sub-location when parentLocation field is passed', () => {
      const sampleLocation = {
        name: 'test location2',
        female: 4,
        male: 1,
        parentLocation: originLocation.id,
      };

      return request(app)
        .post('/api/v1/')
        .send(sampleLocation)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
          assert.equal(response.body.status, 'success');
          assert.equal(response.body.data.name, sampleLocation.name);
        });
    });

    it('/api/v1/ does not create location with invalid name', () => {
      const location = {
        name: 42,
        female: 2,
        male: 0,
      };

      return request(app)
        .put('/api/v1/')
        .send(location)
        .set('Accept', 'application/json')
        .expect(400)
        .then(async (response) => {
          assert.equal(response.body.status, 'failed');
        });
    });

    it('/api/v1/ does not create location with invalid population field values', () => {
      const location = {
        name: 'ruiru',
        female: 'something not a number',
        male: 0,
      };

      return request(app)
        .put('/api/v1/')
        .send(location)
        .set('Accept', 'application/json')
        .expect(400)
        .then(async (response) => {
          assert.equal(response.body.status, 'failed');
        });
    });

    it('/api/v1/ does not create location without population field values', () => {
      const location = {
        name: 'ruiru',
      };

      return request(app)
        .put('/api/v1/')
        .send(location)
        .set('Accept', 'application/json')
        .expect(400)
        .then(async (response) => {
          assert.equal(response.body.status, 'failed');
        });
    });
  });

  describe('PUT endpoint', () => {
    const name = 'test location';

    let originLocation: any;

    before(async () => {
      originLocation = (await getLocation({ name })).value;
    });

    it('/api/v1/ updates a location name', () => {
      const update = {
        id: originLocation.id,
        name: 'test location modified',
      };

      return request(app)
        .put('/api/v1/')
        .send(update)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          assert.equal(response.body.status, 'success');
        });
    });

    it('/api/v1/ updates a location population', () => {
      const update = {
        id: originLocation.id,
        female: 2,
        male: 3,
      };

      return request(app)
        .put('/api/v1/')
        .send(update)
        .set('Accept', 'application/json')
        .expect(200)
        .then(async (response) => {
          assert.equal(response.body.status, 'success');
        });
    });

    it('/api/v1/ does not update a non existent location', () => {
      const update = {
        id: 'some odd stuff',
        female: 2,
      };

      return request(app)
        .put('/api/v1/')
        .send(update)
        .set('Accept', 'application/json')
        .expect(400)
        .then(async (response) => {
          assert.equal(response.body.status, 'failed');
        });
    });
  });

  describe('DELETE endpoint', () => {
    const name = 'test location2';

    let originLocation: any;

    before(async () => {
      originLocation = (await getLocation({ name })).value;
    });

    it('/api/v1/ deletes a location', () => {
      const details = {
        id: originLocation.id,
      };

      return request(app)
        .delete('/api/v1/')
        .send(details)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          assert.equal(response.body.status, 'success');
        });
    });

    it('/api/v1/ does not delete a non existent location', () => {
      const update = {
        id: 'some odd stuff',
        female: 2,
      };

      return request(app)
        .delete('/api/v1/')
        .send(update)
        .set('Accept', 'application/json')
        .expect(400)
        .then(async (response) => {
          assert.equal(response.body.status, 'failed');
        });
    });
  });
});

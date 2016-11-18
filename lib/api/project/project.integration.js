const app = require('../..');
const { request } = require('supertest');

let newThing;

describe('Thing API:', () => {
  describe('GET /api/things', () => {
    let things;

    beforeEach((done) => {
      request(app)
        .get('/api/things')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          things = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      things.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/things', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/things')
        .send({
          name: 'New Thing',
          info: 'This is the brand new thing!!!',
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', () => {
      newThing.name.should.equal('New Thing');
      newThing.info.should.equal('This is the brand new thing!!!');
    });
  });

  describe('GET /api/things/:id', () => {
    let thing;

    beforeEach((done) => {
      request(app)
        .get(`/api/things/${newThing._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          thing = res.body;
          done();
        });
    });

    afterEach(() => {
      thing = {};
    });

    it('should respond with the requested thing', () => {
      thing.name.should.equal('New Thing');
      thing.info.should.equal('This is the brand new thing!!!');
    });
  });

  describe('PUT /api/things/:id', () => {
    let updatedThing;

    beforeEach((done) => {
      request(app)
        .put(`/api/things/${newThing._id}`)
        .send({
          name: 'Updated Thing',
          info: 'This is the updated thing!!!',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedThing = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedThing = {};
    });

    it('should respond with the original thing', () => {
      updatedThing.name.should.equal('New Thing');
      updatedThing.info.should.equal('This is the brand new thing!!!');
    });

    it('should respond with the updated thing on a subsequent GET', (done) => {
      request(app)
        .get(`/api/things/${newThing._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const thing = res.body;

          thing.name.should.equal('Updated Thing');
          thing.info.should.equal('This is the updated thing!!!');

          done();
        });
    });
  });

  describe('PATCH /api/things/:id', () => {
    let patchedThing;

    beforeEach((done) => {
      request(app)
        .patch(`/api/things/${newThing._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Thing' },
          { op: 'replace', path: '/info', value: 'This is the patched thing!!!' },
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          patchedThing = res.body;
          done();
        });
    });

    afterEach(() => {
      patchedThing = {};
    });

    it('should respond with the patched thing', () => {
      patchedThing.name.should.equal('Patched Thing');
      patchedThing.info.should.equal('This is the patched thing!!!');
    });
  });

  describe('DELETE /api/things/:id', () => {
    it('should respond with 204 on successful removal', (done) => {
      request(app)
        .delete(`/api/things/${newThing._id}`)
        .expect(204)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thing does not exist', (done) => {
      request(app)
        .delete(`/api/things/${newThing._id}`)
        .expect(404)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});

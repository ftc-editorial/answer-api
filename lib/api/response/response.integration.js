/**
 * Integration tests for the Response endpoint
 */

// Need to turn off no-used-expressions when using chai.should()
/* eslint-disable no-unused-expressions */

const request = require('supertest');
const agent = require('supertest-koa-agent'); // I'm not sure I like this dep. -Æ
const app = agent(require('../..')).app;
const seed = require('../../seed');
const Project = require('../project/model');
const Question = require('../question/model');

require('chai').should();

describe('Question API:', () => {
  let newQuestion;
  let newProject;
  let newResponse;

  before(async () => {
    await seed({ force: true, log: false });
    newProject = await Project.create({
      title: 'Best Internet Memes 2016',
      description: 'This is going to look really dated in six months...',
      enabled: true,
    });
    newQuestion = await Question.create({
      text: 'Cometh *whom?!*',
      answer: 'HERE COME DAT BOI!',
      options: ['o snip', 'whaddup'],
    });
    newQuestion.setProject(newProject);
  });


  describe('GET /api/v1/question', () => {
    let responses;

    beforeEach((done) => {
      request(app)
        .get('/api/v1/response')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          responses = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      responses.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/v1/response', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/v1/response')
        .send({
          response: 'HERE COMES DAT BOI!!!!!',
          questionId: newQuestion.id,
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newResponse = res.body;
          done();
        });
    });

    it('should respond with the newly created response and timestamp', () => {
      newResponse.value.should.equal('HERE COMES DAT BOI!!!!!');
      new Date(newResponse.submitted).should.be.instanceOf(Date);
      newResponse.questionId.should.equal(newQuestion.id);
    });
  });

  describe('GET /api/v1/response/:id', () => {
    let response;

    beforeEach((done) => {
      request(app)
        .get(`/api/v1/response/${newResponse.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          response = res.body;
          done();
        });
    });

    afterEach(() => {
      response = {};
    });

    it('should respond with the requested response', () => {
      response.value.should.equal('HERE COMES DAT BOI!!!!!');
      new Date(response.submitted).should.be.instanceOf(Date);
      response.questionId.should.equal(newQuestion.id);
    });
  });

  // PUT and DELETE endpoints not necessary; left in case of future use.

  // describe('PUT /api/v1/response/:id', () => {
  //   let updatedResponse;
  //
  //   beforeEach((done) => {
  //     request(app)
  //       .put(`/api/v1/response/${newResponse.id}`)
  //       .send({
  //         value: 'ducks in for Harambe!',
  //       })
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         updatedResponse = res.body;
  //         done();
  //       });
  //   });
  //
  //   afterEach(() => {
  //     updatedResponse = {};
  //   });
  //
  //   it('should respond with the original question', () => {
  //     updatedResponse.value.should.equal('HERE COMES DAT BOI!!!!!');
  //     updatedResponse.submitted.should.be.instanceOf(Date);
  //     updatedResponse.questionId.should.equal(newQuestion.id);
  //   });
  //
  //   it('should respond with the updated thing on a subsequent GET', (done) => {
  //     request(app)
  //       .get(`/api/v1/response/${newResponse.id}`)
  //       .expect(200)
  //       .expect('Content-Type', /json/)
  //       .end((err, res) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         const response = res.body;
  //
  //         response.value.should.equal('ducks in for Harambe!');
  //         response.submitted.should.be.instanceOf(Date);
  //         response.questionId.should.equal(newQuestion.id);
  //         done();
  //       });
  //   });
  // });
  //
  // describe('DELETE /api/v1/response/:id', () => {
  //   it('should respond with 204 on successful removal', (done) => {
  //     request(app)
  //       .delete(`/api/v1/response/${newResponse.id}`)
  //       .expect(204)
  //       .end((err) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });
  //
  //   it('should respond with 404 when Response does not exist', (done) => {
  //     request(app)
  //       .delete(`/api/v1/response/${newResponse.id}`)
  //       .expect(404)
  //       .end((err) => {
  //         if (err) {
  //           return done(err);
  //         }
  //         done();
  //       });
  //   });
  // });
});

/**
 * Integration tests for the Question endpoint
 */

// Need to turn off no-used-expressions when using chai.should()
/* eslint-disable no-unused-expressions */

const request = require('supertest');
const agent = require('supertest-koa-agent'); // I'm not sure I like this dep. -Æ
const app = agent(require('../..')).app;
const seed = require('../../seed');
const Project = require('../project/model');

require('chai').should();

describe('Question API:', () => {
  let newQuestion;
  let newProject;

  before(async () => {
    await seed(true);
    newProject = await Project.create({
      title: 'Sick jams!',
      description: 'Can you complete the lyrics to these hot jams?',
      enabled: true,
    });
  });


  describe('GET /api/v1/question', () => {
    let questions;

    beforeEach((done) => {
      request(app)
        .get('/api/v1/question')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          questions = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      questions.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/v1/question', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/v1/question')
        .send({
          text: 'What is love?',
          answer: { baby: "don't hurt me" },
          options: ['no', 'more'],
          projectId: newProject.id,
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          newQuestion = res.body;
          done();
        });
    });

    it('should respond with the newly created ', () => {
      newQuestion.text.should.equal('What is love?');
      newQuestion.answer.should.eql({ baby: "don't hurt me" });
      newQuestion.options.should.eql(['no', 'more']);
    });
  });

  describe('GET /api/v1/question/:id', () => {
    let question;

    beforeEach((done) => {
      request(app)
        .get(`/api/v1/question/${newQuestion.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          question = res.body;
          done();
        });
    });

    afterEach(() => {
      question = {};
    });

    it('should respond with the requested question', () => {
      question.text.should.equal('What is love?');
      question.answer.should.eql({ baby: "don't hurt me" });
      question.options.should.eql(['no', 'more']);
    });
  });

  describe('PUT /api/v1/question/:id', () => {
    let updatedQuestion;

    beforeEach((done) => {
      request(app)
        .put(`/api/v1/question/${newQuestion.id}`)
        .send({
          text: 'Never gonna give you up',
          answer: { 'never gonna let you down': 'never gonna run around' },
          options: ['and', 'desert', 'you'],
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedQuestion = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedQuestion = {};
    });

    it('should respond with the original thing', () => {
      updatedQuestion.text.should.equal('What is love?');
      updatedQuestion.answer.should.eql({ baby: "don't hurt me" });
      updatedQuestion.options.should.eql(['no', 'more']);
    });

    it('should respond with the updated thing on a subsequent GET', (done) => {
      request(app)
        .get(`/api/v1/question/${newQuestion.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const question = res.body;

          question.text.should.equal('Never gonna give you up');
          question.answer.should.eql({ 'never gonna let you down': 'never gonna run around' });
          question.options.should.eql(['and', 'desert', 'you']);

          done();
        });
    });
  });

  describe('DELETE /api/v1/question/:id', () => {
    it('should respond with 204 on successful removal', (done) => {
      request(app)
        .delete(`/api/v1/question/${newQuestion.id}`)
        .expect(204)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Question does not exist', (done) => {
      request(app)
        .delete(`/api/v1/question/${newQuestion.id}`)
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

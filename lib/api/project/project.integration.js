/**
 * Integration tests for the Projects endpoint
 */

// Need to turn off no-used-expressions when using chai.should()
/* eslint-disable no-unused-expressions */

const request = require('supertest');
const agent = require('supertest-koa-agent'); // I'm not sure I like this dep. -Æ
const app = agent(require('../..')).app;
const seed = require('../../seed');
require('chai').should();

describe('Project API:', () => {
  before(() => seed(true));

  let newProject;

  describe('GET /api/v1/projects', () => {
    let projects;

    beforeEach((done) => {
      request(app)
        .get('/api/v1/projects')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          projects = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      projects.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/v1/projects', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/v1/projects')
        .send({
          title: 'New Project',
          description: 'Hoorah, new project time!',
          enabled: true,
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          newProject = res.body;
          done();
        });
    });

    it('should respond with the newly created project', () => {
      newProject.title.should.equal('New Project');
      newProject.description.should.equal('Hoorah, new project time!');
      newProject.enabled.should.be.truthy;
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    let project;

    beforeEach((done) => {
      request(app)
        .get(`/api/v1/projects/${newProject.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          project = res.body;
          done();
        });
    });

    afterEach(() => {
      project = {};
    });

    it('should respond with the requested project', () => {
      project.title.should.equal('New Project');
      project.description.should.equal('Hoorah, new project time!');
      project.enabled.should.be.truthy;
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    let updatedProject;

    beforeEach((done) => {
      request(app)
        .put(`/api/v1/projects/${newProject.id}`)
        .send({
          title: 'Updated Project',
          description: 'This is the updated project!!!',
          enabled: false,
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedProject = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedProject = {};
    });

    it('should respond with the original thing', () => {
      updatedProject.title.should.equal('New Project');
      updatedProject.description.should.equal('Hoorah, new project time!');
      updatedProject.enabled.should.be.truthy;
    });

    it('should respond with the updated thing on a subsequent GET', (done) => {
      request(app)
        .get(`/api/v1/projects/${newProject.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const project = res.body;

          project.title.should.equal('Updated Project');
          project.description.should.equal('This is the updated project!!!');
          project.enabled.should.be.falsy;

          done();
        });
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should respond with 204 on successful removal', (done) => {
      request(app)
        .delete(`/api/v1/projects/${newProject.id}`)
        .expect(204)
        .end((err) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when project does not exist', (done) => {
      request(app)
        .delete(`/api/v1/projects/${newProject.id}`)
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

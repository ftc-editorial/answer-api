/**
 * Unit tests for the Projects controller
 */

// Need to turn off no-used-expressions when using chai.should()
/* eslint-disable no-unused-expressions */

const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

const projectCtrlStub = {
  select: 'project.select',
  create: 'project.create',
  upsert: 'project.upsert',
  delete: 'project.delete',
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
const projectIndex = proxyquire('./index.js', {
  './controller': projectCtrlStub,
  '../../auth/controller': {
    isAuthenticated: 'isAuthenticated',
  },
})(routerStub); // @TODO figure out what this isn't working

describe('Project API Router:', () => {
  it('should return a Koa 2 router instance', () => {
    projectIndex.should.equal(routerStub);
  });

  describe('GET /api/v1/project', () => {
    it('should route to project.select', () => {
      routerStub.get
        .withArgs('/projects', 'project.select')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/v1/project/:id', () => {
    it('should route to thing.controller.select', () => {
      routerStub.get
        .withArgs('/projects/:id', 'project.select')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/v1/project', () => {
    it('should route to project.upsert', () => {
      routerStub.post
        .withArgs('/projects', 'isAuthenticated', 'project.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/v1/project/:id', () => {
    it('should route to project.upsert', () => {
      routerStub.put
        .withArgs('/projects/:id', 'isAuthenticated', 'project.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/v1/project/:id', () => {
    it('should route to project.delete', () => {
      routerStub.delete
        .withArgs('/projects/:id', 'isAuthenticated', 'project.delete')
        .should.have.been.calledOnce;
    });
  });
});

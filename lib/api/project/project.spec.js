/**
 * Unit tests for the Project controller
 */

// Need to turn off no-used-expressions when using Should()
/* eslint-disable no-unused-expressions */

const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
require('chai').should();

const projectCtrlStub = () => ({
  index: 'project.select',
  show: 'project.select',
  create: 'project.upsert',
  upsert: 'project.upsert',
  destroy: 'project.delete',
});

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
const projectIndex = proxyquire('./index.js', {
  './controller': projectCtrlStub,
})(routerStub);

describe('Project API Router:', () => {
  it('should return a Koa 2 router instance', () => {
    projectIndex.should.equal(routerStub);
  });

  describe('GET /api/v1/project', () => {
    it('should route to project.select', () => {
      routerStub.get
        .withArgs('/', 'project.select')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/v1/project/:id', () => {
    it('should route to thing.controller.select', () => {
      routerStub.get
        .withArgs('/:id', 'project.select')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/v1/project', () => {
    it('should route to project.upsert', () => {
      routerStub.post
        .withArgs('/', 'project.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/v1/project/:id', () => {
    it('should route to project.upsert', () => {
      routerStub.put
        .withArgs('/:id', 'project.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/v1/project/:id', () => {
    it('should route to project.delete', () => {
      routerStub.delete
        .withArgs('/:id', 'project.delete')
        .should.have.been.calledOnce;
    });
  });
});

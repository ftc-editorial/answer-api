/**
 * Unit tests for the Project controller
 */

const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
require('chai').should();

const projectCtrlStub = {
  index: 'project.index',
  show: 'project.show',
  create: 'project.create',
  upsert: 'project.upsert',
  patch: 'project.patch',
  destroy: 'project.destroy',
};

function routerStub() {
  return {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy(),
  };
}

// require the index with our stubbed out modules
const projectIndex = proxyquire('../../routes.js', {
  'koa-router': routerStub,
  './api/project': projectCtrlStub,
});

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

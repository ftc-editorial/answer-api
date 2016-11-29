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

const responseCtrlStub = {
  select: 'response.select',
  create: 'response.create',
  // upsert: 'response.upsert', // We don't use these two endpoints.
  // delete: 'response.delete',
};

const routerStub = {
  get: sinon.spy(),
  post: sinon.spy(),
  // put: sinon.spy(), // We don't use these two endpoints.
  // delete: sinon.spy(),
};

// require the index with our stubbed out modules
const responseIndex = proxyquire('./index.js', {
  './controller': responseCtrlStub,
  '../../auth/controller': {
    isAuthenticated: 'isAuthenticated',
  },
})(routerStub);

describe('Response API Router:', () => {
  it('should return a Koa 2 router instance', () => {
    responseIndex.should.equal(routerStub);
  });

  describe('GET /api/v1/response', () => {
    it('should route to response.controller.select', () => {
      routerStub.get
        .withArgs('/response', 'isAuthenticated', 'response.select')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/v1/response/:id', () => {
    it('should route to response.controller.select', () => {
      routerStub.get
        .withArgs('/response/:id', 'isAuthenticated', 'response.select')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/v1/response', () => {
    it('should route to response.controller.create', () => {
      routerStub.post
        .withArgs('/response', 'response.create')
        .should.have.been.calledOnce;
    });
  });

  // We don't use the PUT or DELETE methods in this endpoint. This is left
  // in case those are ever implemented for whatever reason.
  //
  // describe('PUT /api/v1/response/:id', () => {
  //   it('should route to response.controller.upsert', () => {
  //     routerStub.put
  //       .withArgs('/response/:id', 'isAuthenticated', 'response.upsert')
  //       .should.have.been.calledOnce;
  //   });
  // });
  //
  // describe('DELETE /api/v1/response/:id', () => {
  //   it('should route to response.controller.delete', () => {
  //     routerStub.delete
  //       .withArgs('/response/:id', 'isAuthenticated', 'response.delete')
  //       .should.have.been.calledOnce;
  //   });
  // });
});

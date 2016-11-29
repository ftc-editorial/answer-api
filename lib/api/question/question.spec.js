/**
 * Unit tests for the Question controller
 */

// Need to turn off no-used-expressions when using chai.should()
/* eslint-disable no-unused-expressions */

const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

const questionCtrlStub = {
  select: 'question.select',
  create: 'question.create',
  upsert: 'question.upsert',
  delete: 'question.delete',
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy(),
};

// require the index with our stubbed out modules
const questionIndex = proxyquire('./index.js', {
  './controller': questionCtrlStub,
  '../../auth/controller': {
    isAuthenticated: 'isAuthenticated',
  },
})(routerStub);

describe('Question API Router:', () => {
  it('should return a Koa 2 router instance', () => {
    questionIndex.should.equal(routerStub);
  });

  describe('GET /api/v1/question', () => {
    it('should route to question.controller.select', () => {
      routerStub.get
        .withArgs('/question', 'question.select')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/v1/question/:id', () => {
    it('should route to question.controller.select', () => {
      routerStub.get
        .withArgs('/question/:id', 'question.select')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/v1/question', () => {
    it('should route to question.controller.upsert', () => {
      routerStub.post
        .withArgs('/question', 'isAuthenticated', 'question.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/v1/question/:id', () => {
    it('should route to question.controller.upsert', () => {
      routerStub.put
        .withArgs('/question/:id', 'isAuthenticated', 'question.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/v1/question/:id', () => {
    it('should route to question.controller.delete', () => {
      routerStub.delete
        .withArgs('/question/:id', 'isAuthenticated', 'question.delete')
        .should.have.been.calledOnce;
    });
  });
});

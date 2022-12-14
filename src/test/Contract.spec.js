import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Testing Contract routes', () => {
  describe('GET: /contracts/:id', () => {
    it('Should return the contract when user owns it', (done) => {
      chai
        .request(app)
        .get('/contracts/1')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(1);
          done();
        });
    });

    it("Should return code 404 when contract not found", (done) => {
      chai
        .request(app)
        .get('/contracts/0')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('GET: /contracts', () => {
    it('Should return all active user contracts', (done) => {
      chai
        .request(app)
        .get('/contracts')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });

    it('Should return empty array when user has no active contracts', (done) => {
      chai
        .request(app)
        .get('/contracts')
        .set('profile_id', 5)
        .end((_, res) => {
          res.should.have.status(404);
          res.body.should.be.an('array');
          done();
        });
    });
  });
});

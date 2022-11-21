import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Testing Jobs routes', async () => {
  describe('GET: /jobs/unpaid', () => {
    it('Should return all unpaid jobs for a user for active contracts', (done) => {
      chai
        .request(app)
        .get('/jobs/unpaid')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });

    it('Should return and empty array when user has zero unpaid jobs for active contracts', (done) => {
        chai
          .request(app)
          .get('/jobs/unpaid')
          .set('profile_id', 3)
          .end((_, res) => {
            res.should.have.status(404);
            res.body.should.be.an('array');
            res.body.should.have.property('length').eq(0);
            done();
          });
      });
  });

  describe('POST: /jobs/:job_id/pay', () => {
    it('Should pay an job when client has enough balance', (done) => {
      chai
        .request(app)
        .post('/jobs/2/pay')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.be.an('object');
          done();
        });
    });

    it('Should return error when client doesn;\'t have enough balance to pay', (done) => {
      chai
        .request(app)
        .post('/jobs/5/pay')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('Should return error when job is already paid', (done) => {
      chai
        .request(app)
        .post('/jobs/6/pay')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('Should return error when contract is terminated', (done) => {
      chai
        .request(app)
        .post('/jobs/1/pay')
        .set('profile_id', 6)
        .end((_, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});

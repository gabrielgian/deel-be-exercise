import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Testing Jobs routes', () => {
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
});

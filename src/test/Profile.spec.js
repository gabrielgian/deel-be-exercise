import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Testing Profile routes', async () => {
  describe('POST: /balances/deposit/:userId', () => {
    it("Should update client's balance", (done) => {
      chai
        .request(app)
        .post('/balances/deposit/1')
        .set('profile_id', 1)
        .send({ depositAmount: 100 })
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });

    it("Should return error when depositing on contractor's balance", (done) => {
      chai
        .request(app)
        .post('/balances/deposit/6')
        .set('profile_id', 1)
        .send({ depositAmount: 100 })
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it("Should return error when depositing more than 25%", (done) => {
      chai
        .request(app)
        .post('/balances/deposit/1')
        .set('profile_id', 1)
        .send({ depositAmount: 10000 })
        .end((_, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });
});

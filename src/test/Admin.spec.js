import 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('Testing Admin routes', async () => {
  describe('GET: /admin/best-profession?start=<date>&end=<date>', () => {
    it('Should return the best profession between the specified interval', (done) => {
      chai
        .request(app)
        .get('/admin/best-profession?start=2020-01-01&end=2021-11-01')
        .set('profile_id', 1)
        .end((_, res) => {
          res.should.have.status(200);
          console.log(res.body);
          res.body.should.be.an('object');
          res.body.should.have.property('profession').eq('Programmer');
          done();
        });
    });
  });
});

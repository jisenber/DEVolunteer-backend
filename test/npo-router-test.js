'use strict';

const server = require('../server.js');
const request = require('superagent');
const expect = require('chai').expect;
const Npo = require('../model/npo.js');
const User = require('../model/user.js');
const createError = require('http-errors');

const PORT = process.env.PORT || 3000;
const url = 'http://localhost:3000';

const mockUser = {
  username: 'mockUser',
  email: 'mockEmail',
  password: 'mockPassword',
  isNPO: true,
};
const mockUser1 = {
  username: 'mockUser',
  email: 'mockEmail',
  password: 'mockPassword',
  // isDev: true,
};

const mockNPO = {
  username: 'NeedyPeeps',
  org: 'ChairDisability',
  city: 'NeedyCity',
  state: 'NeedyState',
  phone: '555-555-5555',
  email: 'needy@email.com',
  projects: [],
  reviews: [],
  developers: [],

};

const mockDev = {
  username: 'NeedyDev',
  name: 'Clarence',
  city: 'Seattle',
  state: 'WA',
  phone: '222-222-2222',
  picture:'*.png',
  website: '',
};

//start test server

describe('should start and kill server before unit test', function(){
  before('start the server', function(done) {
    if(server.isRunning === false){
      server.listen(PORT, function(){
        server.isRunning = true;
        done();
      });
    } else {
      done();
    }
  });
  after('turn off server after unit test', function(done){
    server.close((err) => {
      server.isRunning = false;
      if(err){
        done(err);
      } else {
        done();
      }
    });
  });
  afterEach(done => {
    User.remove({}).exec();
    Npo.remove({}).exec()
    .then(() => done())
    .catch(done);
  });
  describe('Testing unauthed GET for all NPOs', function(){
    let testUser;
    let testToken;
    let testNpo;
//depending on how you guys want this to work, we may not need to pass anything through basicAuth if anyone can search this without creating an account.
    beforeEach(done => {
      new User(mockUser).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
      return new Npo(mockNPO).save();
    })
    .then(npo => {
      testNpo = npo;
    })
    .then(() => done())
    .catch(done);
    });

    afterEach(done => {
      User.remove({}).exec();
      Npo.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('will return an array with nPOs', (done) => {
      request.get(`${url}/api/npoList`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body[0].username).to.equal('NeedyPeeps');
        expect(res.body[0].org).to.equal('ChairDisability');
        expect(res.body[0].city).to.equal('NeedyCity');
        expect(res.body[0].password).to.equal(undefined);
        done();
      });
    });
    it('will error if wrong path hit', (done) => {
      request.get(`${url}/npoList`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('#POST -- Testing NPO user', function() {
    let testUser;
    let testToken;

    beforeEach(done => {
      new User(mockUser).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
    })
    .then(() => done())
    .catch(done);
    });
    afterEach(done => {
      User.remove({}).exec();
      Npo.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('will display correct properties of NPO', (done) => {
      request.post(`${url}/api/npo`)
      .set('Authorization', 'Bearer ' + testToken)
      .send(mockNPO)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('NeedyPeeps');
        expect(res.body.org).to.equal('ChairDisability');
        expect(res.body.phone).to.equal('555-555-5555');
        expect(res.body.email).to.equal('needy@email.com');
        expect(Array.isArray(res.body.projects)).to.equal(true);
        expect(Array.isArray(res.body.developers)).to.equal(true);
        expect(Array.isArray(res.body.reviews)).to.equal(true);
        done();
      });
    });
    it('will not post if no authorization', (done) => {
      request.post(`${url}/api/npo`)
      .set('Authorization', 'Bearer ' + '')
      .send(mockNPO)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
  describe('#POST -- Testing NPO user', function() {
    let testUser;
    let testToken;

    beforeEach(done => {
      new User(mockUser1).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
      // return new Npo(mockNPO).save();
    })
    .then(() => done())
    .catch(done);
    });
    after(done => {
      User.remove({}).exec();
      Npo.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('will not allow a dev to POST to NPO', (done) => {
      request.post(`${url}/api/npo`)
      .set('Authorization', 'Bearer ' + testToken)
      .send(mockDev)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('#PUT for user updating info', () => {
    let testNPO;
    let testUser;
    let testToken;

    beforeEach(done => {
      new User(mockUser).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
      return new Npo(mockNPO).save();
    })
    .then(npo => {
      testNPO = npo;
    })
    .then(() => done())
    .catch(done);
    });
    afterEach(done => {
      User.remove({}).exec();
      Npo.remove({}).exec()
      .then(() => done())
      .catch(done);
    });
    it('Should Update a NPO info', (done) => {
      request.put(`${url}/api/npo/${testNPO._id}`)
      .set('Authorization', 'Bearer ' + testToken)
      .send({city: 'Sea', org: 'NewOrg'})
      .end((err, res) => {
        // console.log('RES DOT BODY STUFF',res.body);
        expect(res.status).to.equal(200);
        expect(res.body.city).to.equal('Sea');
        expect(res.body.org).to.equal('NewOrg');
        done();
      });
    });
    it('Should Error if NPO has bad token', (done) => {
      request.put(`${url}/api/npo/${testNPO._id}`)
      .set('Authorization', 'Bearer ' + '')
      .send({city: 'Sea', org: 'NewOrg'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('UnauthorizedError');
        done();
      });
    });
    it('should not update profile if wrong URL', (done) => {
      request.put(`${url}/devs`)
      .set('Authorization', 'Bearer ' + testToken)
      .send({city: 'Sea', org: 'NewOrg'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('# DELETE /API/NPO', function() {
    let testNPO;
    let testUser;
    let testToken;

    beforeEach(done => {
      new User(mockUser).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
      return new Npo(mockNPO).save();
    })
    .then(npo => {
      testNPO = npo;
    })
    .then(() => done())
    .catch(done);
    });
    afterEach(done => {
      User.remove({}).exec();
      Npo.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('should delete a user from the database', (done) => {
      request.delete(`${url}/api/npo`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
    it('should not delete a user if no token', (done) => {
      request.delete(`${url}/api/npo`)
      .set('Authorization', 'Bearer ' + '')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('UnauthorizedError');
        done();
      });
    });
    it('should not delete a user from database with Invalid Token', (done) => {
      request.delete(`${url}/api/npo`)
      .auth('npoTest', 'npoPass')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('UnauthorizedError');
        done();
      });
    });
  });
});

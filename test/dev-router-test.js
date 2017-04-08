'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const Dev = require('../model/dev');
const User = require('../model/user');
const createError = require('http-errors');

const PORT = process.env.PORT || 3000;
const url = 'http://localhost:3000';

let mockUser = {
  username: 'mockUser',
  email: 'mockEmail',
  password: 'mockPassword',
  isDev: true,
};
const mockUser1 = {
  username: 'mockUser',
  email: 'mockEmail',
  password: 'mockPassword',
  // isDev: true,
};

let mockDev = {
  username: 'devUserName',
  name: 'Bocefus',
  city: 'Sea',
  state: 'WA',
  email: 'devEmail@email.com',
  picture: [],
  javascript: 'Javascript',
  services: 'programming',
};

let mockNPO = {
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
    Dev.remove({}).exec()
    .then(() => done())
    .catch(done);
  });
  describe('Testing unauthed GET for all NPOs', function(){
    let testUser;
    let testToken;
    let testDev;
//depending on how you guys want this to work, we may not need to pass anything through basicAuth if anyone can search this without creating an account.
    beforeEach(done => {
      new User(mockUser).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
      return new Dev(mockDev).save();
    })
    .then(dev => {
      testDev = dev;
    })
    .then(() => done())
    .catch(done);
    });

    afterEach(done => {
      User.remove({}).exec();
      Dev.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('will return an array with nPOs', (done) => {
      request.get(`${url}/api/devList`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body[0].username).to.equal('devUserName');
        expect(res.body[0].name).to.equal('Bocefus');
        expect(res.body[0].city).to.equal('Sea');
        expect(res.body[0].password).to.equal(undefined);
        done();
      });
    });
    it('will error if wrong path hit', (done) => {
      request.get(`${url}/aip/devList`)
      .end((err, res) => {
        expect(err.message).to.equal('Not Found')
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('#POST -- Testing Dev User', function() {

    let testUser;
    let testToken;
    before(done => {
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
    after(done => {
      User.remove({}).exec();
      Dev.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('will display correct properties of Dev', (done) => {
      request.post(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + testToken)
      .send(mockDev)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('devUserName');
        expect(res.body.name).to.equal('Bocefus');
        expect(res.body.city).to.equal('Sea');
        expect(res.body.state).to.equal('WA');
        done();
      });
    });
    it('will not display if no token is passed', (done) => {
      request.post(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + '')
      .send(mockDev)
      .end((err, res) => {
        // console.log(res.status)
        expect(res.status).to.equal(401);
        done();
      });
    });
    it('will not display if used wrong token', (done) => {
      request.post(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + 12345)
      .send(mockDev)
      .end((err, res) => {
        console.log(res.status);
        expect(res.status).to.equal(500);
        done();
      });
    });
    it('will not display if wrong URL', (done) => {
      request.post(`${url}/dev`)
      .set('Authorization', 'Bearer ' + testToken)
      .send(mockDev)
      .end((err, res) => {
        console.log(res.status);
        expect(res.status).to.equal(404);
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
      Dev.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('will not allow a dev to POST to NPO', (done) => {
      request.post(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + testToken)
      .send(mockNPO)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(err.message).to.equal('Unauthorized');
        done();
      });
    });
    it('will not allow dev to POST on NPO -- No Token', (done) => {
      request.post(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + '')
      .send(mockNPO)
      .end((err, res) => {
        // console.log(res.status)
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
  describe('#PUT for user updating info', () => {
    let testDev;
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
      return new Dev(mockDev).save();
    })
    .then(dev => {
      testDev = dev;
    })
    .then(() => done())
    .catch(done);
    });
    afterEach(done => {
      User.remove({}).exec();
      Dev.remove({}).exec()
      .then(() => done())
      .catch(done);
    });
    it('Should Update a Dev Info', (done) => {
      request.put(`${url}/api/dev`)
      // console.log(mockDev)
      .set('Authorization', 'Bearer ' + testToken)
      .send({username: 'Salt Lake City', email: 'NewDevEmail@email.com'})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('Salt Lake City');
        expect(res.body.email).to.equal('NewDevEmail@email.com');
        done();
      });
    });
    it('Should Error if Dev has bad token', (done) => {
      request.put(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + '')
      .send({city: 'Sea', org: 'NewOrg'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('UnauthorizedError');
        done();
      });
    });
    it('should not update profile if wrong URL', (done) => {
      request.put(`${url}/npos`)
      .set('Authorization', 'Bearer ' + testToken)
      .send({city: 'Sea', org: 'NewOrg'})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('# DELETE /API/NPO', function() {
    let testDev;
    let testUser;
    let testToken;

    before(done => {
      new User(mockUser).save()
      .then(user => {
        testUser = user;
        return testUser.generateToken();
      })
    .then(token => {
      testToken = token;
      return new Dev(mockDev).save();
    })
    .then(npo => {
      testDev = npo;
    })
    .then(() => done())
    .catch(done);
    });
    afterEach(done => {
      User.remove({}).exec();
      Dev.remove({}).exec()
      .then(() => done())
      .catch(done);
    });

    it('should delete a user from the database', (done) => {
      request.delete(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
    it('should not delete a user if no token', (done) => {
      request.delete(`${url}/api/dev`)
      .set('Authorization', 'Bearer ' + '')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('UnauthorizedError');
        done();
      });
    });
    it('should not delete a user from database with Invalid Token', (done) => {
      request.delete(`${url}/api/dev`)
      .auth('npoTest', 'npoPass')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.text).to.equal('UnauthorizedError');
        done();
      });
    });
  });
});

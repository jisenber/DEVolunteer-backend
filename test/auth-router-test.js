'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
require('../server');

const PORT = process.env.PORT || 3000;
const url = 'http://localhost:3000';

const mockUser = {
  username: 'testyMctesterson',
  password: 'test',
  email: 'test@testy.test',
};

describe('The Auth Route', function(){
  before('start the server', function(done){
    if(server.isRunning === false){
      server.listen(PORT, function(){
        server.isRunning = true;
        done();
      });
    } else {
      done();
    }
  });
  after('should turn the server off', function(done){
    server.close((err) => {
      server.isRunning = false;
      if(err){
        done(err);
      } else {
        done();
      }
    });
  });
  // afterEach(done => {
  //   User.remove({})
  //     .then(() => done())
  //     .catch(done);
  // });

  describe('#POST /API/SIGNUP', function(){
    it('Should return a new token', (done) => {
      request.post(`${url}/api/signup`)
      .send(mockUser)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        // console.log(res);
        expect(!!res.body).to.equal(true);
        done();
      });
    });
    // after(done => {
    //   User.remove({})
    //     .then(() => done())
    //     .catch(done);
    // });


  });

  describe('#GET /API/LOGIN', function() {
    let token;

    it('Will return new token from /signup', function(done) {
      request.get(`${url}/api/login`)
        .auth('testyMctesterson', 'test')
        .end((err, res) => {
          // console.log(res);
          expect(res.status).to.equal(200);
          expect(res.body.password).to.equal(token);
          done();
        });
    });
    it('Will respond 401 if Auth Info Wrong(Pass)', function(done) {
      request.get(`${url}/api/login`)
        .auth('testyMctesterson', 'wrong')
        .end((err, res) => {
          // console.log(res);
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
    });
    it('Will respond 401 if Auth Info Wrong(USER/PASS)', function(done) {
      request.get(`${url}/api/login`)
        .auth('wrong', 'test')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('UnauthorizedError');
          done();
        });
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });

  });



});
//
// describe('Un-Auth /GET for users', function() {
//   let userTest;
//   before(done => {
//     new User(mockUser).save()
//     .then(user => {
//       userTest = user;
//       userTest.save();
//     })
//     .then(() => done())
//     .catch(done);
//   });
//   after(done => {
//     User.remove({})
//     .then(() => done())
//     .catch(done);
//   });
//
  // it('will return an array of ONLY USER IDs', function(done){
  //   request.get(`${url}/api/users`)
  //   .end((err, res) => {
  //     expect(res.status).to.equal(200);
  //     expect(Array.isArray(res.body)).to.equal(true);
  //     expect(res.body[0].id).to.equal(this.id);
  //     done();
  //   });
  // });
  // it('will Error if invalid url given', function(done) {
  //   request.get(`${url}/games`)
  //   .end((err, res) => {
  //     expect(res.status).to.equal(404);
  //     done();
  //   });
//   });
//   it('Will Give Additional USER INFO', function(done) {
//     request.get(`${url}/users/${userTest._id}`)
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       expect(res.body.username).to.equal('testyMctesterson');
//       expect(res.body.email).to.equal('test@testy.test');
//       expect(Array.isArray(res.body.reviews)).to.equal(true);
//       expect(Array.isArray(res.body.favMovies)).to.equal(false);
//       done();
//     });
//   });
// });
//
// describe('/users/:id', function() {
//   let userTest;
//   before(done => {
//     new User(mockUser).save()
//     .then(user => {
//       userTest = user;
//       userTest.save();
//     })
//     .then(() => done());
//   });
//   after(done => {
//     User.remove({})
//     .then(() => done())
//     .catch(done);
//   });
//
//   it('will return the requested user with limitied information', function(done){
//     request.get(`${url}/users/${userTest._id}`)
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       expect(res.body._id).to.equal(userTest.id);
//       expect(res.body.username).to.equal('testyMctesterson');
//       done();
//     });
//   });
//   it('will give error adding email and not ID (400)', function(done) {
//     request.get(`${url}/users/${userTest.email}`)
//     .end((err, res) => {
//       expect(res.status).to.equal(400);
//       expect(Array.isArray(res.body)).to.equal(false);
//       done();
//     });
//   });
//   it('Will give error for invalid USER ID', function(done) {
//     request.get(`${url}/users/5555`)
//     .end((err, res) => {
//       expect(res.status).to.equal(400);
//       expect(res.body._id).to.not.exist;
//       expect(res.text).to.equal('user not found');
//       done();
//     });
//   });
// });
//

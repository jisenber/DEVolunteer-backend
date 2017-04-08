'use strict';

const User = require('../../model/user');

module.exports = function(done) {
  new User({
    username: 'npoUsername',
    email: 'npoEmail',
    password:'supersecret',
    isDev: false,
    isNPO: false,
  })
  .generatePasswordHash('1x2x3x')
  .then( user => user.save())
  .then( user => {
    this.testUser = user;
    return user.generateToken();
  })
  .then(token => {
    this.testToken = token;
    done();
  })
  .catch(done);
};

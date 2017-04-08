'use strict';

const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-midd.js');
const authRouter = module.exports = new Router();
const bearerAuth = require('../lib/bearer-auth-midd.js');
const User = require('../model/user.js');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();


//posts a new user with their information

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  req.body.addDate = new Date();
  let user = new User(req.body);

  user.generatePasswordHash(user.password)
  .then(user  => user.save())
  .then(user => user.generateToken())
  .then(token => res.json(token))
  .catch(next);
});

//sends the users token if they log in successfully
authRouter.get('/api/login', basicAuth, (req, res, next) => {

  User.findOne({username: req.auth.username})
  .then(user => {
    if(!user) return Promise.reject(next(createError(401)));
    return user.comparePasswordHash(req.auth.password);
  })
  .then(user => user.generateToken())
  .then(token => res.json(token))
  .catch(next);
});

//tested route below on curl and it works.
authRouter.get('/api/user', bearerAuth, (req, res, next) => {
  User.findOne({username: req.user.username})
  .then(user => {
    if(!user) return Promise.reject(next(createError(401)));
    delete user.password;
    res.json(user);
  })
    .catch(next);
});

authRouter.delete('/api/user', bearerAuth, (req, res, next) => {
  User.findOneAndRemove({username: req.user.username}).exec()
  .then(() => res.status(204).end())
  .catch(err => {
    console.error(err);
  });
});

let Router = require('express').Router;
let bearerAuth = require('../lib/bearer-auth-midd.js');
// let basicAuth = require('../lib/basic-auth-midd.js')
let createError = require('http-errors');
let Dev = require('../model/dev');
let jsonParser = require('body-parser').json();

let router = module.exports = new Router();


//unauthed get all devs to pass to filtered dev list

router.get('/api/devList', (req, res, next) => {
  console.log('in the dev router get for finding devs');

  Dev.find()
  .then(allDevsObj => {
    res.send(allDevsObj);
  })
  .catch(next);
});

//req.user should be a individual user which the bearer auth will identify
router.post('/api/dev', bearerAuth, jsonParser, (req, res, next) => {
  if(!req.user.isDev) return next(createError(401, 'Please log in as a Developer'));

  //req.body will be values from the form they fill out on angular front-end
  const dev = new Dev(req.body);
  dev.save()
  .then(dev => res.json(dev))
  .catch(next);
});


//get individual ID

router.get('/api/dev/:id', bearerAuth, (req, res, next) => {
  if(!req.user) return next(createError(401, 'please log in as a developer'));
  Dev.findById(req.params.id)
  .then(dev => {
    if(!dev) return next(createError(404, 'not found'));
    res.json(dev);
  })
  .catch(err => {
    console.error(err);
  });
});


router.get('/api/dev', bearerAuth, (req, res, next) => {
  if(!req.user.isDev) return next(createError(401, 'please log in as a developer'));

  Dev.findOne({username: req.user.username})
  .then( dev => {
    //if dev is null, return a 404 error. This is important for edit profile functionality
    if(!dev) return next(createError(404, 'Not found'));
    res.json(dev);
  })
  .catch(err => {
    console.error(err);
  });
});

router.put('/api/dev', bearerAuth, jsonParser, (req, res, next) => {
  return Dev.findOneAndUpdate({username: req.user.username}, req.body, {new: true})
  .then(dev => {
    res.json(dev);
  })
  .catch(next);
});


router.delete('/api/dev', bearerAuth, (req, res) => {
  Dev.findOneAndRemove({username: req.user.username}).exec()
  .then(() => res.status(204).end())
  .catch(err => {
    console.error(err);
  });
});

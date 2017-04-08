
// let Router = require('express').Router;
// let bearerAuth = require('../lib/bearer-auth-midd.js');
// // let basicAuth = require('../lib/basic-auth-midd.js')
// let createError = require('http-errors');
// let Dev = require('../model/dev');
// let Npo = require('../model/npo');
// let User = require('../model/user');
//
// let router = module.exports = new Router();
//
// router.delete('/api/user', bearerAuth, (req, res, next) => {
//
//   if (req.user.isDev) {
//
//         User.findOneAndRemove({username: req.user.username}).exec()
//        .then(() => res.status(204).end())
//        .catch(next(createError(400, 'bad request')));
//     }
//     // catch (e) {
//     //   User.findOneAndRemove({username: req.user.username}).exec()
//     //   .then(() => res.status(204).end())
//     //   .catch(next(createError(400, 'bad request')));
//     // }
//
//    else if (req.user.isNpo) {
//
//     console.log('DELETEING A USER WHO IS AN NPO AS WELL');
//     Npo.findOneAndRemove({username: req.user.username}).exec();
//     User.findOneAndRemove({username: req.user.username}).exec()
//     .then(() => res.status(204).end())
//     .catch(next(createError(400, 'bad request')));
//
//   } else {
//
//     console.log('DELETEING ONLY A USER');
//     console.log(req.user);
//     User.findOneAndRemove({username: req.user.username}).exec()
//     .then(() => res.status(204).end())
//     .catch(next(createError(400, 'bad request')));
//   }
// });

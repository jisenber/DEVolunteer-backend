'use strict';

const theServer = require('../../server');
const serverController = module.exports = {};
let server;

serverController.start = (done) => {
  if(!theServer.isRunning)
    return server = theServer.listen(process.env.PORT, () => {
      theServer.isRunning = true;
      console.log('Server is RUNNING', process.env.PORT);
      done();
    });
  done();
};

serverController.stop = (done) => {
  if(theServer.isRunning)
    return server.close(() => {
      theServer.isRunning = false;
      console.log('Server is DOWN', process.env.PORT);
      done();
    });
  done();
};// module.exports = exports = {};
//
// exports.serverUp = function(server, done){
//   if(!server.isRunning){
//     server.listen(process.env.PORT, () => {
//       server.isRunning = true;
//       console.log('server is running');
//       done();
//     });
//     return;
//   }
//   done();
// };
//
// exports.serverDown = function(server, done){
//   if(server.isRunning){
//     server.close(err => {
//       if(err) return done(err);
//       server.isRunning = false;
//       console.log('server isn\'t running');
//       done();
//     });
//     return;
//   }
//   done();
// };

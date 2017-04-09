'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRouter = require('./route/auth-router.js');
const devRouter = require('./route/dev-router');
const npoRouter = require('./route/npo-router.js');
const errorMiddleware = require('./lib/error-midd.js');
const cloudinary = require('cloudinary');

const app = express();
// dotenv.load();

//local mongo db will be called 'devolunteer'
const PORT = process.env.PORT || 80;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;


mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(express.static(`${__dirname}/build`));
app.use(cors());
app.use(morgan('dev'));
app.use(authRouter);
app.use(devRouter);
app.use(npoRouter);
app.use(errorMiddleware);

module.exports = app;

// if(require.main === module) {
const server = module.exports = app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
server.isRunning = true; //setup for testing ability to toggle on/off in before block
// }

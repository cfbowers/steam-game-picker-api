/* eslint-disable no-undef */
require('./data/mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const d = require('debug')('steam-roulette-api:server');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('tiny', { skip: () => !process.env.DEBUG }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/steam', require('./route/steam'));
app.use('/steam/auth', require('./route/steamAuth'));
app.use('/auth', require('./route/auth'));
app.use('/profile', require('./route/profile'));
app.use('/users', require('./route/user'));
app.use(errorHandler);

const server = app.listen(port, () => d(`running on ${port}`));


module.exports = server; 
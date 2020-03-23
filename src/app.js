/* eslint-disable no-undef */
require('dotenv').config(); 
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
app.use('/', require('./routes/index'));
app.use(errorHandler);


exports.server = app.listen(port, () => d(`running on ${port}`));
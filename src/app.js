require('./data/mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const d = require('debug')('steam-roulette-api:server');


const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('tiny', { skip: () => !process.env.DEBUG }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/steam', require('./routes/steam'));
app.use('/steam/auth', require('./routes/steamAuth'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/users', require('./routes/user'));

const server = app.listen(port, () => d(`running on ${port}`));


module.exports = server; 
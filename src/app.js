require('dotenv').config(); 
require('./data/mongoose');
const d = require('debug')('steam-roulette-api:server');
const ex = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const errors = require('./middleware/errorHandler'); 


const app = ex();
const port = process.env.PORT || 3001;

app.use(ex.json());
app.use(ex.urlencoded({ extended: false }));
app.use(cors());
app.use('/', routes);
app.use(errors);


exports.server = app.listen(port, () => d(`running on ${port}`));
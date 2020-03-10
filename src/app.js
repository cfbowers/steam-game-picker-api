require('./data/mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/steam', require('./routes/steam'));
app.use('/steam/auth', require('./routes/steamAuth'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/users', require('./routes/user'));

const server = app.listen(port, () => console.log('Server is running on port: ', port));

module.exports = server; 
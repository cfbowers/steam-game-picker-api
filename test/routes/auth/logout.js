const request = require('supertest');
const server = require('../../../src/app');
const expect = require('chai').expect; 
const h = require('../../helpers');
const User = require('../../../src/data/models/user');

describe('logout endpoints', function() {


  it('removes current token on logout', async function() {
    const email = 'hello@demo.com';
    const loginRes = await h.post('/auth/login', { email, password: 'password' });
    const currentToken = loginRes.body.data.token;
    const logoutRes = await request(server)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${currentToken}`)
    user = await User.findOne({ email });
    const oldToken = user.tokens.find(token => token.token === currentToken);

    expect(logoutRes.body).to.have.property('data', 'logout successful');
    expect(logoutRes.body).to.have.property('status', 'success');
    expect(oldToken).to.be.undefined; 
  });

});
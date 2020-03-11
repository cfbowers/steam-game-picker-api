const expect = require('chai').expect; 
const User = require('../../../src/data/models/user');
const h = require('../../helpers');

describe('logout endpoints', function() {

  it('removes current token on logout', async function() {
    const loginRes = await h.post('/auth/login', { email: 'hello@demo.com', password: 'password' });
    const currentToken = loginRes.body.data.token;
    const logoutRes = await h.post('/auth/logout', {}, currentToken);
    const user = await User.findOne({ email });
    const oldToken = user.tokens.find(token => token.token === currentToken);

    h.checkSuccess(logoutRes);
    expect(oldToken).to.be.undefined; 
  });

  after(() => h.exit());

});
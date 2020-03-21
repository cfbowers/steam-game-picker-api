const expect = require('chai').expect; 
const User = require('../../../src/data/models/user');
const h = require('../../helpers');

describe('logout endpoints', function() {
  const logoutUrl = '/auth/logout';
  const logoutAllUrl = '/auth/logoutAll';

  h.testUnauthenticatedPost(logoutUrl);
  h.testUnauthenticatedPost(logoutAllUrl);

  it('removes current token on logout', async function() {
    const email = 'hello@demo.com';
    const loginRes = await h.post('/auth/login', { email, password: 'password' });
    const currentToken = loginRes.body.data.token;
    const logoutRes = await h.post(logoutUrl, {}, currentToken);
    const user = await User.findOne({ email });
    const oldToken = user.tokens.find((token) => token.token === currentToken);

    h.checkSuccess(logoutRes);
    expect(oldToken).to.be.undefined; 
  });

  after(() => h.exit());

});
/* eslint-disable no-undef */
const h = require('./helpers'), 
  expect = require('chai').expect, 
  loginUrl = '/auth/login';

describe('login endpoint', function () {
  const email = 'hello@demo.com', password = 'password';

  it('successful with valid credentials ', async function () {
    const res = await h.post(loginUrl, { email, password });
    h.checkSuccess(res);
    expect(res.body.data).to.have.property('user'); 
    expect(res.body.data).to.have.property('token'); 
  }); 

  it('fails with invalid password', () => testInvalidCredentials(email, 'pass')); 
  it('fails with invalid email', () => testInvalidCredentials('nope', password)); 
  it('fails with blank credentials', () => testInvalidCredentials('', '')); 

  async function testInvalidCredentials(email, password) {
    const res = await h.post(loginUrl, { email, password });
    h.checkFailure(res);
    expect(res.body.data).to.equal('wrong username or password');
  }
  
  after(() => h.exit());
});
/* eslint-disable no-undef */
const request = require('supertest'); 
const server = require('../src/app');
const helper = require('./helpers');
const expect = require('chai').expect; 

describe('authentication endpoint', function () {

  it('successful with valid credentials ', async function () {
    const res = await request(server)
      .post('/auth/login')
      .send({ email: 'hello@demo.com', password: 'password' });
    helper.checkSuccess(res);
  }); 

  it('fails with invalid credentials ', async function () {
    const res = await request(server)
      .post('/auth/login')
      .send({ email: 'hello@demo.com', password: 'pass' });
    expect(res.body).to.have.property('error', 'wrong username or password');
  }); 

  it('fails with no credentials ', async function () {
    const res = await request(server)
      .post('/auth/login')
      .send({ email: '', password: '' });
    expect(res.body).to.have.property('error', 'wrong username or password');
  }); 

  after(() => server.close());
  
});




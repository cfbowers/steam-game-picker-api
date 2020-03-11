/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest'); 
const server = require('../src/app');
const mongoose = require('../src/data/mongoose');

async function post(url, body, token = undefined) {
  if (token) 
    return await request(server).post(url).send(body).set('Authorization', `Bearer ${token}`);
  else 
    return await request(server).post(url).send(body);
}

function checkSuccess(res) { 
  expect(res.type, 'application/json');
  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('status', 'success');
  expect(res.body).to.have.property('data');
}

function checkFailure(res, expectedStatus = 400) { 
  expect(res.type, 'application/json');
  expect(res.status).to.equal(expectedStatus);
  expect(res.body).to.have.property('status', 'fail');
  expect(res.body).to.have.property('data');
}

function testUnauthenticatedPost(url, body = {}) {
  it(`${url} fails when not authenticated`, async function() {
    const res = await post(url, body); 
    checkFailure(res, 401);
  });
}

function exit() {
  server.close(); 
  mongoose.disconnect();
}

module.exports = {
  checkSuccess,
  checkFailure,
  testUnauthenticatedPost,
  post,
  exit
};
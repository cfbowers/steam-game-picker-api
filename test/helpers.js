/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest'); 
const server = require('../src/app');

async function post(url, body) {
  return res = await request(server).post(url).send(body);
}

function checkSuccess(res) { 
  expect(res.type, 'application/json');
  expect(res.status, 200);
  expect(res.body).to.have.property('status', 'success');
  expect(res.body).to.have.property('data');
}

function checkFailure(res) { 
  expect(res.type, 'application/json');
  expect(res.status, 400);
  expect(res.body).to.have.property('status', 'fail');
  expect(res.body).to.have.property('data');
}

function exit() {
  server.close(); 
}

module.exports = {
  checkSuccess,
  checkFailure,
  post,
  exit
};
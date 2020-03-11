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
  mongoose.disconnect();
}

module.exports = {
  checkSuccess,
  checkFailure,
  post,
  exit
};
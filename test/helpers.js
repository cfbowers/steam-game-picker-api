/* eslint-disable no-undef */
const expect = require('chai').expect;

function checkSuccess(res) { 
  expect(res.type, 'application/json');
  expect(res.status, 200);
}

module.exports = {
  checkSuccess
};
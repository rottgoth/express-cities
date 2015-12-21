'use strict';
var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

describe('Requests to the root path', function() {
  it('Returns a 200 status code', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns a HTML format', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });

  it('Returns an index file with cities', function(done) {
    request(app)
      .get('/')
      .expect(/cities/i, done);
  });
});

describe('Listing cities on /cities', function() {
  // if we were to add test data to our database
  // before(function() {
  //   client.hset('cities', 'Colima', 'Some description');
  //   client.hset('cities', 'San Francisco', 'cool description');
  //   client.hset('cities', 'Oakland', 'super far description');
  // });

  it('Returns 200 status code', function(done) {
    request(app)
      .get('/cities')
      .expect(200, done);
  });

  it('Retuns JSON format', function(done) {
    request(app)
      .get('/cities')
      .expect('Content-Type', /json/, done);
  });

  it('Returns initial cities', function(done) {
    request(app)
      .get('/cities')
      .expect(JSON.stringify([]), done);
      // if we load some data we can asset is resturned
      // .expect(JSON.stringify(['Colima', 'San Francisco', 'Oakland']), done);
  });
});

describe('Creating new cities', function() {
  before(function() {

  });

  it('Returns a 201 status code', function(done) {
    request(app)
      .post('/cities')
      .send('name=Springfield&descriptions=Where+the+simpsons+live')
      .expect(201, done);
  });

  it('Return a city name', function(done) {
    request(app)
      .post('/cities')
      .send('name=Springfield&descriptions=Where+the+simpsons+live')
      .expect(/Springfield/, done);
  });
});

describe('Deleting cities', function() {

  before(function() {
    client.hset('cities', 'Banana', 'some fruit city');
  });

  after(function() {
    client.flushdb();
  });

  it('Returns a 204 status code', function(done) {
    request(app)
      .delete('/cities/Banana')
      .expect(204, done);
  });
});
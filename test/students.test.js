const supertest = require('supertest');
const assert = require('assert');
const app = require('../index.js');
const { expect } = require('chai');


describe('GET /students', function () {
  let server;
  beforeEach(function () {
    server = require('../index.js');
  });
  afterEach(function () {
    server.close();
  });

  it('responds with json', function (done) {
    supertest(server)
      .get('/students')
      //.set('Accept', 'application/json')
      //.expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('responds with json, part 2', function (done) {
    supertest(server)
      .get('/students')
      //.set('Accept', 'application/json')
      //.expect('Content-Type', /json/)
      .expect(200, done);
  });



});


/*

describe('GET /students', function () {
  it('responds with json', async function () {
    console.log("KIDS!!")
    const response = await request.get("/students");

    expect(response.status).to.eql(200);
  });
});

describe('First Test', () => {
  it('does shit', () => {
    console.log("shit did");
    assert.ok(5 == 5);

  })
})


describe('GET /user', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  
describe('Students route works', done => {
  it('what should it do here?', () => {
    request(app)
      .get("/students")
      .expect("Content-Type", /json/)
      .expect({ name: "bag of butts" })
      .expect(200, done);
  })
})


*/
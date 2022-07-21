const request = require('supertest');
const assert = require('assert');


const app = require('../index.js'); //reference to your app.js file

describe('First Test', () => {
    it('does shit', () => {
        console.log("shit did");
        assert.ok(5 == 5);
        
    })
})


/*
describe('GET /user', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  */

  describe('GET /students', function() {
    it('responds with json', function(done) {
        console.log("KIDS!!")
      const results = request(app)
        .get('/students')
        //.set('Accept', 'application/json')
        //.expect('Content-Type', /json/)
        .expect(200, done);
        //console.log(results);
    });
  });
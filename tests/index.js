//This test needs to start the server
var boot = require('../app').boot,//Ensure you create this method in app.js
    shutdown = require('../app').shutdown,//Ensure you create this method in app.js
    port = require('../app').port,//This method has already set in app.js
    superagent = require('superagent'),
    expect = require('expect');

describe('server', function() {
    //First boot server
    before(function() {
        boot();
    });
    //Next test response th GET
    describe('homepage', function() {
        it('should respond to GET', function(done) {
            superagent
                .get('http://localhost:' + port)
                .end(function(err, res) {
                expect(res.status).toBe(200);
                done() //This makes the test asynchronous
            })
        })
    });
    //Then shut server down
    after(function() {
        shutdown();
    });
});
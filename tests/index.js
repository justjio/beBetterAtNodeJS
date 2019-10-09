//This test needs to start the server
var boot = require('../app').boot,//Ensure you create this method in app.js
    shutdown = require('../app').shutdown,//Ensure you create this method in app.js
    port = require('../app').port,//This method has already set in app.js
    superagent = require('superagent'),
    expect = require('expect');

var seedArticles = require('../db/articles.json');

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
    //Check if app will show post from seed data on homepage
    it('should contain posts', function(done) {
        superagent
            .get('http://localhost:' + port)
            .end(function(err, res) {
                seedArticles.forEach((item, index, list) => {
                    const expected = `<h2><a href="/articles/${item.slug}">${item.title}`;
                    if(item.published) {
                        expect(res.text).toContain(expected);
                    };
                    console.log(item.title, res.text);
                })
                done()
            })
    });

    //New article page test suite
    describe('article page', function() {
        it('should display text', function(done) {
            var n = seedArticles.length;
            seedArticles.forEach((item, index, list) =>  {
                superagent
                    .get('http://localhost:' + port + '/articles/' + seedArticles[index].slug)
                    .end(function(err, res) {
                        if (item.published) {
                            expect(res.text).toContain(seedArticles[index].text);
                        } else {
                            expect(res.status).toBe(401);
                        }
                        //console.log(item.title)
                        if (index + 1 === n) {
                            done()
                        }
                    })
            })
        })
    });

    //Then shut server down
    after(function() {
        shutdown();
    });
});
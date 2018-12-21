//Gulp test

let should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    mongoose = require('mongoose'),
    Quote = mongoose.model('Quote'),
    agent = request.agent(app);

//Describing insert,update, delete, get.
describe('Quote Crud Test', function(){
    it('Should allow a quote to be posted and return a _id', function(done){
        var quotePost = {quote: 'new Quote', author: 'Jon', genre:'Fiction'};

        agent.post('/api/quotes')
            .send(quotePost)
            .expect(200)
            .end(function(err, result){
                //results.body.read.should.not.equal(false);
                results.body.should.have.property('_id');
                done()
            })
    })
    afterEach(function(done){
        Quote.remove().exec();
        done();
    })
})



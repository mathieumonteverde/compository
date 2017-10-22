
const fs = require('fs');
const chai = require('chai');
const nock = require('nock');
const githubapi = require('../githubapi.js');

let should = chai.should();

describe('GET repo', () => {
  
  beforeEach(() =>{
    
    // Succeeded repo request
    let succeededRepo = JSON.parse(
      fs.readFileSync(__dirname + '/succeededRepoRequest.json', 'utf8')
    );
    
    nock('https://api.github.com')
      .get('/repos/octokit/octokit.rb')
      .reply(200, succeededRepo);
    
    
    // Failed repo request (Repo not found)
    let failedRepo = JSON.parse(
      fs.readFileSync(__dirname + '/failedRepoRequest.json', 'utf8')
    );
    
    nock('https://api.github.com')
      .get('/repos/octokit/unknown')
      .reply(404, failedRepo);
      
      
    // Simulate an exceeded limit request
    let exceededLimit = JSON.parse(
      fs.readFileSync(__dirname + '/exceededLimitRequest.json', 'utf8')
    );
    
    nock('https://api.github.com')
      .get('/repos/octokit/limit')
      .reply(403, exceededLimit);
  });
  
  
  it('should return octokit/octokit.rb repo', (done) => {
    // Get a repo
    githubapi.getRepo('octokit', 'octokit.rb', (err, response) => {
      should.not.exist(err);
      should.exist(response);
      response.should.be.a('String');
      
      // Parse the response
      const json = JSON.parse(response);
      
      // Check some properties
      json.should.have.property('name');
      json.should.have.property('full_name');
      json.should.have.property('pushed_at');
      json.should.have.property('description');
      json.should.have.property('open_issues_count');
      json.should.have.property('forks_count');
      
      done();
    });
  });
  
  
  it('should return an error (Repo not found)', (done) => {
    // Get a repo
    githubapi.getRepo('octokit', 'unknown', (err, response) => {
      should.not.exist(response);
      should.exist(err);
      err.message.should.be.a('string');
      err.message.should.equal('Not Found');

      done();
    });
  });
  
  
  it('should return an error (Exceeded limit request)', (done) => {
    // Get a repo
    githubapi.getRepo('octokit', 'limit', (err, response) => {
      should.not.exist(response);
      should.exist(err);

      err.message.should.be.a('string');
      let error = err.message.startsWith('API rate limit exceeded');
      error.should.equal(true);

      done();
    });
  });
});


  
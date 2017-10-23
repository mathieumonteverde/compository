/**
  file: githubapi.js
  authors: Sathiya Kirushnapillai & Mathieu Monteverde

  Contains the GitHubAPI class.
*/

const https = require('https');

class GitHubAPI {
  static get host() {
    return 'api.github.com';
  }

  static get port() {
    return 443;
  }

  static get headers() {
    return {
      Accept: 'application/vnd.github.v3+json',
      'user-agent': 'node.js',
    };
  }

  static get githubSecret() {
    if (process.env.github_secret === undefined) {
      return '';
    }

    return process.env.github_secret;
  }

  static get clientID() {
    if (process.env.github_id === undefined) {
      return '';
    }
    return process.env.github_id;
  }

  static getRepo(owner, repo, callback) {
    const options = {
      host: GitHubAPI.host,
      path: `/repos/${owner}/${repo}?client_id=${GitHubAPI.clientID}&client_secret=${GitHubAPI.githubSecret}`,
      port: GitHubAPI.port,
      headers: GitHubAPI.headers,
    };

    const req = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        // Get json data
        const json = JSON.parse(data);

        // Check if the repo exist
        if (response.statusCode === 404 && json.message !== undefined && json.message === 'Not Found') {
          callback(new Error(json.message), null);
        } else if (response.statusCode === 403 && json.message !== undefined && json.message.startsWith('API rate limit exceeded')) {
          // Check if the limit request is exceeded
          callback(new Error(json.message), null);
        } else if (response.statusCode !== 200) {
          // Other errors
          callback(new Error('An error occured'), null);
        } else {
          // Call the callback with data
          callback(null, data);
        }
      });
    });

    req.on('error', (e) => {
      callback(e, null);
    });

    req.end();
  }

  static getNumberOfCommits(owner, repo, callback) {
    this.getNumberOf(`/repos/${owner}/${repo}/commits`, callback);
  }

  static getNumberOfContributors(owner, repo, callback) {
    this.getNumberOf(`/repos/${owner}/${repo}/contributors`, callback);
  }

  static getNumberOf(url, callback) {
    const options = {
      host: GitHubAPI.host,
      path: `${url}?per_page=1&client_id=${GitHubAPI.clientID}&client_secret=${GitHubAPI.githubSecret}`,
      port: GitHubAPI.port,
      headers: GitHubAPI.headers,
    };

    const req = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        // Get json data
        const json = JSON.parse(data);

        // Check if the repo exist
        if (response.statusCode === 404 && json.message !== undefined && json.message === 'Not Found') {
          callback(new Error(json.message), null);
        } else if (response.statusCode === 403 && json.message !== undefined && json.message.startsWith('API rate limit exceeded')) {
          // Check if the limit request is exceeded
          callback(new Error(json.message), null);
        } else if (response.statusCode !== 200) {
          // Other errors
          callback(new Error('An error occured'), null);
        } else {
          const { headers } = response;
          const { link } = headers;

          let numberOfCommits = 1;

          if (link !== undefined) {
            [, numberOfCommits] = link.match(/(\d+)>; rel="last"$/);
          }

          callback(null, numberOfCommits);
        }
      });
    });

    req.on('error', (e) => {
      callback(e, null);
    });

    req.end();
  }
}

module.exports = GitHubAPI;

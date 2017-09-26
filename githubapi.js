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

  static getRepo(owner, repo, callback) {
    // Options de la requête http
    const options = {
      host: GitHubAPI.host,
      path: `/repos/${owner}/${repo}`,
      port: GitHubAPI.port,
      headers: GitHubAPI.headers,
    };

    // Traitement de la requête
    const r = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        callback(data);
      });
    });

    r.end();
  }

  static getCommits(owner, repo, callback) {
    // Options de la requête http
    const options = {
      host: GitHubAPI.host,
      path: `/repos/${owner}/${repo}/commits`,
      port: GitHubAPI.port,
      headers: GitHubAPI.headers,
    };

    // Traitement de la requête
    const r = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        callback(data);
      });
    });

    r.end();
  }
}

module.exports = GitHubAPI;

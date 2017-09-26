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
    this.request(`/repos/${owner}/${repo}`, callback);
  }

  static getCommits(owner, repo, callback) {
    this.request(`/repos/${owner}/${repo}/commits`, callback);
  }

  static getContributors(owner, repo, callback) {
    this.request(`/repos/${owner}/${repo}/contributors`, callback);
  }

  static getIssues(owner, repo, callback) {
    this.request(`/repos/${owner}/${repo}/issues`, callback);
  }

  static request(requestPath, callback) {
    // Options de la requête http
    const options = {
      host: GitHubAPI.host,
      path: requestPath,
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

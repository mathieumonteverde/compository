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
    this.request(`/repos/${owner}/${repo}`, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        callback(data);
      });
    });
  }

  static getNumberOfCommits(owner, repo, callback) {
    this.request(`/repos/${owner}/${repo}/commits?per_page=1`, (response) => {
      const { headers } = response;
      const { link } = headers;

      let numberOfCommits = 1;

      if (link !== undefined) {
        [, numberOfCommits] = link.match(/(\d+)>; rel="last"$/);
      }

      callback(numberOfCommits);
    });
  }

  static getNumberOfContributors(owner, repo, callback) {
    this.request(`/repos/${owner}/${repo}/contributors?per_page=1`, (response) => {
      const { headers } = response;
      const { link } = headers;

      let numberOfContributors = 1;

      if (link !== undefined) {
        [, numberOfContributors] = link.match(/(\d+)>; rel="last"$/);
      }

      callback(numberOfContributors);
    });
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
    const r = https.request(options, callback);

    r.end();
  }
}

module.exports = GitHubAPI;

module.exports = {
    "extends": "airbnb-base",
    "env": {
      "jquery": true,
      "mocha": true,
    },
    "globals" : {
      "document": false,
      "RepositorySelector": false,
    },
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
};

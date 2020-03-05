// jest.config.js
module.exports = {
  testMatch: [
    "**/?(*.)+(spec|test)?(.*).js?(x)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ]
};

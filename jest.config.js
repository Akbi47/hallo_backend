module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['./src'],
  setupFiles: ["<rootDir>/test/dotenv-config.js"],
};
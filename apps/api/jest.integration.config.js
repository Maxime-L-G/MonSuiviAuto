/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  testMatch: ["**/*.integration.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/../jest.integration.setup.js"],
}

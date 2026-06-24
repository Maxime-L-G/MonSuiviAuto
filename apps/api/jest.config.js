/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["\\.integration\\.test\\.ts$"],
  setupFiles: ["dotenv/config"],
}

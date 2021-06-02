module.exports = {
  testPathIgnorePatterns: ["/node_module/", "/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTest.ts"
  ],
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  }
}
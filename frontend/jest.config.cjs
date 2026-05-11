module.exports = {
  testEnvironment: "jsdom",
  rootDir: ".",
  moduleDirectories: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom"
  },
  testPathIgnorePatterns: ['/e2e/'],
};

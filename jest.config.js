module.exports = {
  cacheDirectory: '<rootDir>/.cache/jest',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js}'],
  coveragePathIgnorePatterns: ['__fixtures__', 'src/constants', 'src/index.js'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  displayName: 'captainslog',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {},
  modulePathIgnorePatterns: ['<rootDir>[/\\\\](\\dist)'],
  rootDir: './',
  roots: ['<rootDir>/src/'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['__fixtures__'],
};

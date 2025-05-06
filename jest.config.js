module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',      
    '^.+\\.(js|jsx)$': 'babel-jest', 
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testMatch: [
    '**/tests/**/*.test.tsx',
    '**/tests/**/*.test.ts',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!expo-router|@react-navigation|other-modules-to-transform).*/',
  ],  
  moduleNameMapper: {
      '^.+\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/mocks/fileMock.js',
    '^expo-router$': '<rootDir>/mocks/expo-router.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  },
};

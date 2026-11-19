import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  displayName: 'API',
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.env.setup.ts'],
  testMatch: ['<rootDir>/__test__/api/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)

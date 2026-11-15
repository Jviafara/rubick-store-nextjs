import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import { MotionGlobalConfig } from 'framer-motion'

const createJestConfig = nextJest({
  dir: './',
})

MotionGlobalConfig.skipAnimations = true

const config: Config = {
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^swiper/css(?:/.*)?$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
}

export default createJestConfig(config)

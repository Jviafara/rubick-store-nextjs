import { MotionGlobalConfig } from 'framer-motion'
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

MotionGlobalConfig.skipAnimations = true

const config: Config = {
  displayName: 'ui',
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/__test__/api/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^swiper/css(?:/.*)?$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
}

export default createJestConfig(config)

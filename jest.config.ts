import type { Config } from 'jest'

const config: Config = {
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  projects: ['<rootDir>/jest.config.ui.ts', '<rootDir>/jest.config.api.ts'],
}

export default config

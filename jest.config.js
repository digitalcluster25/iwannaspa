export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@radix-ui/react-slot@1.1.2$': '@radix-ui/react-slot',
    '^@radix-ui/react-label@2.1.2$': '@radix-ui/react-label',
    '^class-variance-authority@0.7.1$': 'class-variance-authority',
    '^lucide-react@0.487.0$': 'lucide-react',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@supabase|@radix-ui))',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  globals: {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    'import.meta': {
      env: {
        VITE_SUPABASE_URL: 'http://localhost:54321',
        VITE_SUPABASE_ANON_KEY: 'test-key',
        VITE_OPENAI_API_KEY: 'test-key',
      },
    },
  },
}

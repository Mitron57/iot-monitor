module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.tsx"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
      "^.+\\.(ts|tsx)$": [
        "ts-jest",
        {
          tsconfig: "tsconfig.json",
        },
      ],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    testMatch: ["<rootDir>/src/**/__tests__/**/*.(ts|tsx)", "<rootDir>/src/**/*.(test|spec).(ts|tsx)"],
    collectCoverageFrom: ["src/**/*.(ts|tsx)", "!src/**/*.d.ts", "!src/index.tsx", "!src/setupTests.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
  }
  
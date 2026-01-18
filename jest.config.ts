import type {Config } from 'jest';

const config: Config = {
    preset: "ts-jest",
    testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'], // importing jest-dom matchers library
    testMatch: [
        "**/__tests__/**/*.?([mc])[jt]s?(x)", "**/tests/**/*.?([mc])[jt]s?(x)"
    ]
};

export default config; 

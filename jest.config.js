module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: {warnOnly: true},
    },
  },
  reporters: ["default", "jest-html-reporters"],
  testTimeout: 35000,
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "js"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["./test/jest.setup.ts"],
  testEnvironment: "node",
  moduleNameMapper: {
    "@test/(.*)": "<rootDir>/test/$1",
    "@/(.*)": "<rootDir>/src/$1",
  },
};

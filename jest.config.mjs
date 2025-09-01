export default {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testMatch: [
    "<rootDir>/tests/**/*.test.(ts|tsx)",
    "<rootDir>/tests/**/*.spec.(ts|tsx)",
    "<rootDir>/src/**/*.(test|spec).(ts|tsx)",
  ],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|react-native-code-push)",
  ],
}

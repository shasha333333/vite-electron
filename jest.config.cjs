module.exports = {
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
    "**/__tests__/**/*.mjs",
    "**/?(*.)+(spec|test).mjs"
  ],
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "mjs"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest"
  },
  testPathIgnorePatterns: ["/node_modules/"],
  roots: ["<rootDir>/electron"]
}; 
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}'
  ],
  "coverageThreshold": {
    "./src/**/*": {
      "statements": 90
    }
  },
  verbose: true
}
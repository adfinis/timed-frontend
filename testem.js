/* eslint-env node */
/* eslint-disable camelcase */
module.exports = {
  framework: 'mocha+chai',
  test_page: 'tests/index.html',
  disable_watching: true,
  parallel: -1,
  launch_in_dev: [],
  launch_in_ci: ['chromium'],
  browser_args: {
    chromium: [
      '--headless',
      '--disable-gpu',
      '--remote-debugging-port=9222',
      '--window-size=1440,900'
    ],
    firefox: ['--headless']
  }
}

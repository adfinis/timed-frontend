"use-strict";

module.exports = {
  test_page: "tests/index.html?hidepassed",
  disable_watching: true,
  parallel: -1,
  launch_in_dev: [],
  launch_in_ci: ["chrome"],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? "--no-sandbox" : null,
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-software-rasterizer",
        "--mute-audio",
        "--remote-debugging-port=9222",
        "--window-size=1440,900",
      ].filter(Boolean),
    },
  },
};

module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launch_in_ci": [
    "SL_Chrome_Current",
    "SL_Firefox_Current",
    "SL_Safari_Current",
    "SL_Safari_Last",
    "SL_MS_Edge",
    "SL_IE_11"
  ],
  "launch_in_dev": [
    "PhantomJS",
    "Firefox",
    "Chrome"
  ],
  "launchers": {
    "SL_Chrome_Current": {
      "exe": "./node_modules/.bin/ember-cli-sauce",
      "args": [
        "-b",
        "chrome",
        "-v",
        "latest",
        "--at",
        "--no-ct",
        "--u"
      ],
      "protocol": "browser"
    },
    "SL_Firefox_Current": {
      "exe": "./node_modules/.bin/ember-cli-sauce",
      "args": [
        "-b",
        "firefox",
        "-v",
        "latest",
        "--at",
        "--no-ct",
        "--u"
      ],
      "protocol": "browser"
    },
    "SL_Safari_Current": {
      "exe": "./node_modules/.bin/ember-cli-sauce",
      "args": [
        "-b",
        "safari",
        "-v",
        "9",
        "--at",
        "--no-ct",
        "--u"
      ],
      "protocol": "browser"
    },
    "SL_Safari_Last": {
      "exe": "./node_modules/.bin/ember-cli-sauce",
      "args": [
        "-b",
        "safari",
        "-v",
        "8",
        "--at",
        "--no-ct",
        "--u"
      ],
      "protocol": "browser"
    },
    "SL_MS_Edge": {
      "exe": "./node_modules/.bin/ember-cli-sauce",
      "args": [
        "-b",
        "microsoftedge",
        "--at",
        "--no-ct",
        "--u"
      ],
      "protocol": "browser"
    },
    "SL_IE_11": {
      "exe": "./node_modules/.bin/ember-cli-sauce",
      "args": [
        "-b",
        "internet explorer",
        "-v",
        "11",
        "--at",
        "--no-ct",
        "--u"
      ],
      "protocol": "browser"
    }
  }
}

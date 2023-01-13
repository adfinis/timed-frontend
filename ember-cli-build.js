"use strict";

// eslint-disable-next-line node/no-missing-require
const Funnel = require("broccoli-funnel");
const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    fontawesome: {
      icons: {
        "free-solid-svg-icons": "all",
        "free-regular-svg-icons": ["clock"],
      },
    },
    sassOptions: {
      onlyIncluded: true,
    },
    "ember-fetch": {
      preferNative: true,
    },
    "ember-simple-auth": {
      useSessionSetupMethod: true,
    },
    "ember-site-tour": {
      importHopscotchJS: true,
      importHopscotchCSS: true,
    },
    "ember-validated-form": {
      theme: "bootstrap",
    },
  });

  app.import("vendor/adcssy.css");
  app.import("node_modules/@fontsource/source-sans-pro/index.css");

  app.import("node_modules/downloadjs/download.min.js", {
    using: [{ transformation: "amd", as: "downloadjs" }],
  });

  const fonts = new Funnel("node_modules/@fontsource/source-sans-pro/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/",
  });

  return app.toTree([fonts]);
};

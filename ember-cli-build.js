"use strict";

// eslint-disable-next-line node/no-extraneous-require
const Funnel = require("broccoli-funnel");
const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    sassOptions: {
      onlyIncluded: true,
    },
    babel: {
      plugins: ["@babel/plugin-proposal-object-rest-spread"],
    },
    "ember-site-tour": {
      importHopscotchJS: true,
      importHopscotchCSS: true,
    },
    "ember-validated-form": {
      theme: "bootstrap",
    },
  });

  app.import("vendor/adcssy.min.css");
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

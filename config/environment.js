/* jshint node: true */

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "timed",
    environment,
    rootURL: "/",
    locationType: "auto",
    moment: {
      includeTimezone: "all",
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
    },

    APP: {
      REPORTEXPORTS: [
        {
          label: "CSV",
          url: "/api/v1/reports/export",
          params: {
            file_type: "csv",
          },
        },
        {
          label: "ODS",
          url: "/api/v1/reports/export",
          params: {
            file_type: "ods",
          },
        },
        {
          label: "XLSX",
          url: "/api/v1/reports/export",
          params: {
            file_type: "xlsx",
          },
        },
        {
          label: "Work report",
          url: "/api/v1/work-reports",
          params: {},
        },
      ],
      EXPORT_LIMIT: 100000,
    },

    "ember-simple-auth-oidc": {
      host: "/auth/realms/timed/protocol/openid-connect",
      clientId: "timed-public",
      authEndpoint: "/auth",
      tokenEndpoint: "/token",
      endSessionEndpoint: "/logout",
      userinfoEndpoint: "/userinfo",
      afterLogoutUri: "/",
    },
  };

  if (environment === "development") {
    ENV["ember-simple-auth-oidc"].host =
      "http://timed.local/auth/realms/timed/protocol/openid-connect";
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;

    ENV["ember-tether"] = {
      bodyElementId: "ember-testing",
    };
  }

  // eslint-disable-next-line no-empty
  if (environment === "production") {
    ENV["ember-simple-auth-oidc"].host = "sso-client-host";
    ENV["ember-simple-auth-oidc"].clientId = "sso-client-id";
  }

  return ENV;
};

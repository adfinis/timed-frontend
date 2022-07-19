import EmberRouter from "@ember/routing/router";
import config from "timed/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

const resetNamespace = true;

// eslint-disable-next-line array-callback-return
Router.map(function () {
  this.route("login");
  this.route("no-access");

  this.route("protected", { path: "/" }, function () {
    this.route("index", { resetNamespace, path: "/" }, function () {
      this.route("activities", { path: "/" }, function () {
        this.route("edit", { path: "/edit/:id" });
      });
      this.route("attendances");
      this.route("reports");
    });
    this.route("analysis", { resetNamespace }, function () {
      this.route("edit");
    });
    this.route("statistics", { resetNamespace });
    this.route("projects", { resetNamespace });
    this.route("users", { resetNamespace }, function () {
      this.route("edit", { path: "/:user_id" }, function () {
        this.route("credits", function () {
          this.route("overtime-credits", function () {
            this.route("edit", { path: "/:overtime_credit_id" });
            this.route("new");
          });
          this.route("absence-credits", function () {
            this.route("edit", { path: "/:absence_credit_id" });
            this.route("new");
          });
        });
        this.route("responsibilities");
      });
    });
    this.route("notfound", { resetNamespace, path: "/*path" });
  });
});

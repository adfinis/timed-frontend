import Application from "@ember/application";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";
import ResizeObserver from "resize-observer-polyfill";
import config from "timed/config/environment";
// simplebar setup
// see components/scroll-container for further usage
import "simplebar";
import "simplebar/dist/simplebar.css";

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}
// simplebar setup end

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

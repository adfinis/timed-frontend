import Controller from "@ember/controller";
import { next } from "@ember/runloop";

export default class ControllersQPControllerController extends Controller {
  #defaults = {};

  constructor(...args) {
    super(...args);

    // defer until the extending controller has set it's query params
    next(() => this.storeQPDefaults());
  }

  storeQPDefaults() {
    this.queryParams.forEach((qp) => {
      this.#defaults[qp] = this[qp];
    });
  }

  resetQueryParams({ except = [] }) {
    this.queryParams.forEach((qp) => {
      if (!except.includes(qp)) {
        this[qp] = this.#defaults[qp];
      }
    });
  }

  get allQueryParams() {
    return this.queryParams.reduce(
      (acc, key) =>
        Object.defineProperty(acc, key, {
          value: this[key],
          enumerable: true,
        }),
      {}
    );
  }
}

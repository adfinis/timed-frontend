import { action } from "@ember/object";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";

const isTouchDevice = !!window && "ontouchstart" in window;
if (typeof FastBoot === "undefined") {
  (function (ElementProto) {
    if (typeof ElementProto.matches !== "function") {
      ElementProto.matches =
        ElementProto.msMatchesSelector ||
        ElementProto.mozMatchesSelector ||
        ElementProto.webkitMatchesSelector;
    }

    if (typeof ElementProto.closest !== "function") {
      ElementProto.closest = function closest(selector) {
        let element = this;
        while (element && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }
          element = element.parentNode;
        }
        return null;
      };
    }
  })(window.Element.prototype);
}

export default class OptimizedPowerSelectOptionsComponent extends Component {
  isTouchDevice = isTouchDevice;

  get isTesting() {
    if (macroCondition(isTesting())) {
      return true;
    }
    return false;
  }

  @action
  addHandlers(element) {
    const role = element.getAttribute("role");
    if (role === "group") {
      return;
    }
    const findOptionAndPerform = (action, e) => {
      const optionItem = e.target.closest("[data-option-index]");
      if (!optionItem) {
        return;
      }
      if (optionItem.closest("[aria-disabled=true]")) {
        return; // Abort if the item or an ancestor is disabled
      }
      const optionIndex = optionItem.getAttribute("data-option-index");
      action(this._optionFromIndex(optionIndex), e);
    };
    element.addEventListener("mouseup", (e) =>
      findOptionAndPerform(this.args.select.actions.choose, e)
    );
    if (this.args.highlightOnHover) {
      element.addEventListener("mouseover", (e) =>
        findOptionAndPerform(this.args.select.actions.highlight, e)
      );
    }
    if (this.isTouchDevice) {
      const touchMoveHandler = () => {
        this.hasMoved = true;
        if (element) {
          element.removeEventListener("touchmove", touchMoveHandler);
        }
      };
      // Add touch event handlers to detect taps
      element.addEventListener("touchstart", () => {
        element.addEventListener("touchmove", touchMoveHandler);
      });
      element.addEventListener("touchend", (e) => {
        const optionItem = e.target.closest("[data-option-index]");

        if (!optionItem) {
          return;
        }

        e.preventDefault();
        if (this.hasMoved) {
          this.hasMoved = false;
          return;
        }

        if (optionItem.closest("[aria-disabled=true]")) {
          return; // Abort if the item or an ancestor is disabled
        }

        const optionIndex = optionItem.getAttribute("data-option-index");
        this.args.select.actions.choose(this._optionFromIndex(optionIndex), e);
      });
    }
    if (role !== "group") {
      this.args.select.actions.scrollTo(this.args.select.highlighted);
    }
  }

  @action
  removeHandlers(element) {
    element.removeEventListener("mouseup", this.mouseUpHandler);
    element.removeEventListener("mouseover", this.mouseOverHandler);
    element.removeEventListener("touchstart", this.touchStartHandler);
    element.removeEventListener("touchmove", this.touchMoveHandler);
    element.removeEventListener("touchend", this.touchEndHandler);
  }

  _optionFromIndex(index) {
    const parts = index.split(".");
    let option = this.args.options[parseInt(parts[0], 10)];
    for (let i = 1; i < parts.length; i++) {
      option = option.options[parseInt(parts[i], 10)];
    }
    return option;
  }
}

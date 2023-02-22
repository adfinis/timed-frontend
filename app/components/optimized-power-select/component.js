import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class OptimizedPowerSelectComponent extends Component {
  get extra() {
    return this.args.extra ?? {};
  }

  @action
  onFocus({ actions, isOpen }) {
    if (!isOpen) {
      actions.open();
    }
  }

  @action
  onKeydown(select, e) {
    // this implementation is heavily inspired by the enter key handling of EPS
    // https://github.com/cibernox/ember-power-select/blob/6e3d5781a105515b915d407d571698c57290f674/addon/components/power-select.ts#L519
    if (e.keyCode === 9 && select.isOpen && select.highlighted !== undefined) {
      select.actions.choose(select.highlighted, e);
      e.stopImmediatePropagation();
      return false;
    }
  }
}

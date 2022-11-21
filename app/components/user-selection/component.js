import { hbs } from 'ember-cli-htmlbars';
import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

const SELECTED_TEMPLATE = hbs`{{selected.longName}}`;

const OPTION_TEMPLATE = hbs`
  <div class="{{unless option.isActive 'inactive'}}" title="{{option.longName}}{{unless option.isActive ' (inactive)'}}">
    {{option.longName}}
    {{#unless option.isActive}}
      <i class="fa fa-ban"></i>
    {{/unless}}
  </div>
`;

export default Component.extend({
  tracking: service("tracking"),
  store: service("store"),

  tagName: "",

  selectedTemplate: SELECTED_TEMPLATE,

  optionTemplate: OPTION_TEMPLATE,

  queryOptions: null,

  async init(...args) {
    this._super(...args);

    try {
      await this.get("tracking.users").perform();
    } catch (e) {
      /* istanbul ignore next */
      if (e.taskInstance && e.taskInstance.isCanceling) {
        return;
      }

      /* istanbul ignore next */
      throw e;
    }
  },

  users: computed("queryOptions", async function() {
    await this.get("tracking.users.last");
    const queryOptions = this.queryOptions || {};

    queryOptions.ordering = "username";
    return this.store.query("user", queryOptions);
  })
});

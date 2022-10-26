import { hbs } from 'ember-cli-htmlbars';
import Component from "@ember/component";
import { get, computed } from "@ember/object";
import { capitalize } from "@ember/string";
import moment from "moment";
import parseDjangoDuration from "timed/utils/parse-django-duration";

const PLAIN_LAYOUT = hbs`{{value}}`;
const DURATION_LAYOUT = hbs`{{humanize-duration value false}}`;
const MONTH_LAYOUT = hbs`{{moment-format (moment value 'M') 'MMMM'}}`;

const COLUMN_MAP = {
  year: [
    { title: "Year", path: "year", layout: PLAIN_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT }
  ],
  month: [
    { title: "Year", path: "year", layout: PLAIN_LAYOUT },
    { title: "Month", path: "month", layout: MONTH_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT }
  ],
  customer: [
    { title: "Customer", path: "customer.name", layout: PLAIN_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT }
  ],
  project: [
    { title: "Customer", path: "project.customer.name", layout: PLAIN_LAYOUT },
    { title: "Project", path: "project.name", layout: PLAIN_LAYOUT },
    {
      title: "Estimated",
      path: "project.estimatedTime",
      layout: DURATION_LAYOUT
    },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT }
  ],
  task: [
    {
      title: "Customer",
      path: "task.project.customer.name",
      layout: PLAIN_LAYOUT
    },
    { title: "Project", path: "task.project.name", layout: PLAIN_LAYOUT },
    { title: "Task", path: "task.name", layout: PLAIN_LAYOUT },
    { title: "Estimated", path: "task.estimatedTime", layout: DURATION_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT }
  ],
  user: [
    {
      title: "User",
      path: "user.fullName",
      ordering: "user__username",
      layout: PLAIN_LAYOUT
    },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT }
  ]
};

export default Component.extend({
  maxDuration: computed("data.last.value.@each.duration", function() {
    return (
      this.get("data.last.value") &&
      moment.duration(
        Math.max(...this.get("data.last.value").mapBy("duration"))
      )
    );
  }),

  total: computed("data.last.value", function() {
    return parseDjangoDuration(
      get(this, "data.last.value.meta.total-time") ?? null
    );
  }),

  columns: computed("type", function() {
    return get(COLUMN_MAP, this.type).map(col => ({
      ...col,
      ordering: col.ordering || col.path.replace(/\./g, "__")
    }));
  }),

  missingParamsMessage: computed("missingParams.[]", function() {
    if (!this.get("missingParams.length")) {
      return "";
    }

    const text = this.missingParams
      .map((param, index) => {
        if (index === 0) {
          param = capitalize(param);
        }

        if (this.get("missingParams.length") > 1) {
          if (index + 1 === this.get("missingParams.length")) {
            param = `and ${param}`;
          } else if (index + 2 !== this.get("missingParams.length")) {
            param = `${param},`;
          }
        }

        return param;
      })
      .join(" ");

    const suffix =
      this.get("missingParams.length") > 1
        ? "are required parameters"
        : "is a required parameter";

    return `${text} ${suffix} for this statistic`;
  })
});

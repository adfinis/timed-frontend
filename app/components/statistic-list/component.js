import { get } from "@ember/object";
import { capitalize } from "@ember/string";
import Component from "@glimmer/component";
import moment from "moment";
import parseDjangoDuration from "timed/utils/parse-django-duration";

const PLAIN_LAYOUT = "PLAIN";
const DURATION_LAYOUT = "DURATION";
const MONTH_LAYOUT = "MONTH";

const COLUMN_MAP = {
  year: [
    { title: "Year", path: "year", layout: PLAIN_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  month: [
    { title: "Year", path: "year", layout: PLAIN_LAYOUT },
    { title: "Month", path: "month", layout: MONTH_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  customer: [
    { title: "Customer", path: "customer.name", layout: PLAIN_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  project: [
    { title: "Customer", path: "project.customer.name", layout: PLAIN_LAYOUT },
    { title: "Project", path: "project.name", layout: PLAIN_LAYOUT },
    {
      title: "Estimated",
      path: "project.estimatedTime",
      layout: DURATION_LAYOUT,
    },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  task: [
    {
      title: "Customer",
      path: "task.project.customer.name",
      layout: PLAIN_LAYOUT,
    },
    { title: "Project", path: "task.project.name", layout: PLAIN_LAYOUT },
    { title: "Task", path: "task.name", layout: PLAIN_LAYOUT },
    { title: "Estimated", path: "task.estimatedTime", layout: DURATION_LAYOUT },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
  user: [
    {
      title: "User",
      path: "user.fullName",
      ordering: "user__username",
      layout: PLAIN_LAYOUT,
    },
    { title: "Duration", path: "duration", layout: DURATION_LAYOUT },
  ],
};

export default class StatisticList extends Component {
  get maxDuration() {
    return (
      this.args.data?.last?.value &&
      moment.duration(Math.max(...this.args.data.last.value.mapBy("duration")))
    );
  }

  get total() {
    return parseDjangoDuration(
      this.args.data?.last?.value?.meta?.["total-time"] ?? null
    );
  }

  get columns() {
    return get(COLUMN_MAP, this.args.type).map((col) => ({
      ...col,
      ordering: col.ordering || col.path.replace(/\./g, "__"),
    }));
  }

  get missingParamsMessage() {
    if (!this.args.missingParams?.length) {
      return "";
    }

    const text = this.args.missingParams
      .map((param, index) => {
        if (index === 0) {
          param = capitalize(param);
        }

        if (this.args.missingParams.length > 1) {
          if (index + 1 === this.args.missingParams.length) {
            param = `and ${param}`;
          } else if (index + 2 !== this.args.missingParams.length) {
            param = `${param},`;
          }
        }

        return param;
      })
      .join(" ");

    const suffix =
      this.args.missingParams.length > 1
        ? "are required parameters"
        : "is a required parameter";

    return `${text} ${suffix} for this statistic`;
  }
}

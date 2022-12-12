import Component from "@ember/component";
import { action } from "@ember/object";
import classic from "ember-classic-decorator";
import moment from "moment";

@classic
export default class DateButtons extends Component {
  init(...args) {
    super.init(...args);
    this.set("choices", [
      "this week",
      "this month",
      "this year",
      "last week",
      "last month",
      "last year",
    ]);
  }

  @action
  selectDate(expr) {
    switch (expr) {
      case "this week":
        this.onUpdateFromDate(moment().day(1));
        this.onUpdateToDate(null);
        break;
      case "this month":
        this.onUpdateFromDate(moment().date(1));
        this.onUpdateToDate(null);
        break;
      case "this year":
        this.onUpdateFromDate(moment().dayOfYear(1));
        this.onUpdateToDate(null);
        break;
      case "last week":
        this.onUpdateFromDate(moment().subtract(1, "week").day(1));
        this.onUpdateToDate(moment().subtract(1, "week").day(7));
        break;
      case "last month":
        this.onUpdateFromDate(moment().subtract(1, "month").startOf("month"));
        this.onUpdateToDate(moment().subtract(1, "month").endOf("month"));
        break;
      case "last year":
        this.onUpdateFromDate(moment().subtract(1, "year").startOf("year"));
        this.onUpdateToDate(moment().subtract(1, "year").endOf("year"));
        break;
    }
  }
}

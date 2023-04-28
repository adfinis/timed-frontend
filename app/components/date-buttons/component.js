import { action } from "@ember/object";
import Component from "@glimmer/component";
import moment from "moment";

export default class DateButtonsComponent extends Component {
  choices = [
    "this week",
    "this month",
    "this year",
    "last week",
    "last month",
    "last year",
  ];

  @action
  selectDate(expr) {
    switch (expr) {
      case "this week":
        this.args.onUpdateFromDate(moment().day(1));
        this.args.onUpdateToDate(null);
        break;
      case "this month":
        this.args.onUpdateFromDate(moment().date(1));
        this.args.onUpdateToDate(null);
        break;
      case "this year":
        this.args.onUpdateFromDate(moment().dayOfYear(1));
        this.args.onUpdateToDate(null);
        break;
      case "last week":
        this.args.onUpdateFromDate(moment().subtract(1, "week").day(1));
        this.args.onUpdateToDate(moment().subtract(1, "week").day(7));
        break;
      case "last month":
        this.args.onUpdateFromDate(
          moment().subtract(1, "month").startOf("month")
        );
        this.args.onUpdateToDate(moment().subtract(1, "month").endOf("month"));
        break;
      case "last year":
        this.args.onUpdateFromDate(
          moment().subtract(1, "year").startOf("year")
        );
        this.args.onUpdateToDate(moment().subtract(1, "year").endOf("year"));
        break;
    }
  }
}

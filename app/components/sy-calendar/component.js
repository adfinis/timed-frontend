import { action } from "@ember/object";
import PowerCalendarComponent from "ember-power-calendar/components/power-calendar";
import moment from "moment";

const CURRENT_YEAR = moment().year();

const YEARS_IN_FUTURE = 5;

export default class SyCalendar extends PowerCalendarComponent {
  months = moment.months();

  years = [...new Array(40).keys()].map(
    (i) => `${CURRENT_YEAR + YEARS_IN_FUTURE - i}`
  );

  @action
  changeCenter(unit, event) {
    const date = this.publicAPI.center;
    const newCenter = moment(date)[unit](event.target.value);

    this.onCenterChange({ moment: newCenter });
  }
}

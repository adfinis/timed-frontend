import Component from "@glimmer/component";

export default class WeeklyOverviewBenchmark extends Component {
  /**
   * Maximum worktime
   *
   * This is 'only' 20h since noone works 24h a day..
   *
   * @property {Number} max
   * @public
   */
  get max() {
    return this.args.max || 20;
  }

  /**
   * The offset to the bottom
   *
   * @property {String} style
   * @public
   */
  get style() {
    return { bottom: `calc(100% / ${this.max} * ${this.args.hours})` };
  }
}

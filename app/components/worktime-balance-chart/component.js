import { computed } from "@ember/object";
import EmberChartComponent from "ember-cli-chart/components/ember-chart";
import moment from "moment";
import humanizeDuration from "timed/utils/humanize-duration";

const FONT_FAMILY = "TheSansLT";

export default EmberChartComponent.extend({
  type: "line",

  data: computed("worktimeBalances.[]", function() {
    if (!this.get("worktimeBalances")) {
      return [];
    }

    return {
      labels: this.get("worktimeBalances").mapBy("date"),
      datasets: [
        {
          data: this.get("worktimeBalances").map(balance =>
            balance.get("balance").asHours()
          )
        }
      ]
    };
  }),

  init(...args) {
    this._super(...args);

    this.set("options", {
      lineTension: 0,
      legend: { display: false },
      layout: { padding: 10 },
      elements: {
        line: {
          borderColor: "rgb(91, 142, 219)",
          backgroundColor: "transparent",
          borderWidth: 2
        },
        point: {
          borderColor: "rgb(91, 142, 219)",
          backgroundColor: "rgb(255, 255, 255)",
          hoverBackgroundColor: "rgb(0,0,0)",
          borderWidth: 2,
          radius: 3.5,
          hoverRadius: 3.5,
          hitRadius: 10
        }
      },
      scales: {
        xAxes: [
          {
            ticks: {
              callback(value) {
                return [value.format("DD"), value.format("dd").toUpperCase()];
              },
              fontFamily: FONT_FAMILY,
              fontColor: "rgb(180, 180, 180)"
            },
            gridLines: {
              drawBorder: false,
              display: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              drawTicks: false,
              borderDash: [5, 5]
            }
          }
        ]
      },
      tooltips: {
        displayColors: false,
        cornerRadius: 4,
        bodyFontFamily: FONT_FAMILY,
        bodyFontSize: 12,
        titleFontFamily: FONT_FAMILY,
        titleFontSize: 14,
        titleFontStyle: "normal",
        titleMarginBottom: 10,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          title([{ index }], { labels }) {
            return labels[index].format("DD.MM.YYYY");
          },
          label({ yLabel: hours }) {
            return humanizeDuration(moment.duration({ hours }));
          }
        }
      }
    });
  }
});

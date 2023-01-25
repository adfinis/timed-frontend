import Component from "@ember/component";
import { inject as service } from "@ember/service";

export default class ReportReviewWarning extends Component {
  @service
  session;

  @service
  unverifiedReports;

  @service
  rejectedReports;
}

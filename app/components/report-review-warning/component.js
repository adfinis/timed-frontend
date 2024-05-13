import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class ReportReviewWarning extends Component {
  @service currentUser;

  @service unverifiedReports;

  @service rejectedReports;
}

import classic from "ember-classic-decorator";
import { tagName } from "@ember-decorators/component";
import { inject as service } from "@ember/service";
import Component from "@ember/component";

@classic
@tagName("")
export default class ReportReviewWarning extends Component {
  @service
  session;

  @service
  unverifiedReports;
}

import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { inject as service } from "@ember/service";
import classic from "ember-classic-decorator";

@classic
@tagName("")
export default class ReportReviewWarning extends Component {
  @service
  session;

  @service
  unverifiedReports;
}

import classic from "ember-classic-decorator";
import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@tagName("")
class AsyncListComponent extends Component {}

AsyncListComponent.reopenClass({
  positionalParams: ["data"]
});

export default AsyncListComponent;

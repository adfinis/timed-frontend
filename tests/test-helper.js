import { setApplication } from "@ember/test-helpers";
import { start } from "ember-qunit";
import * as QUnit from "qunit";
import { setup } from "qunit-dom";

import Application from "../app";
import config from "../config/environment";

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();

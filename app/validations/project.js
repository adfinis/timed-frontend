import { validatePresence } from "ember-changeset-validations/validators";

export default {
  name: validatePresence(true),
  billingType: validatePresence(true),
};

import { validatePresence } from "ember-changeset-validations/validators";

export default {
  user: validatePresence(true),
  date: validatePresence(true),
  duration: validatePresence(true),
};

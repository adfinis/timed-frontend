import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators'

export default {
  user: validatePresence(true),
  date: validatePresence(true),
  absenceType: validatePresence(true),
  days: [validatePresence(true), validateNumber({ integer: true })]
}

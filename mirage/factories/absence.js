import { Factory } from "ember-cli-mirage";
import faker from "faker";
import moment from "moment";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  date: () => moment().format("YYYY-MM-DD"),
  duration: () => "08:30:00",

  afterCreate(absence, server) {
    absence.update({
      absenceTypeId: server.schema.absenceTypes.all().models[0].id,
    });
  },
});

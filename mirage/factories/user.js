import { Factory } from "ember-cli-mirage";
import faker from "faker";
import moment from "moment";

export default Factory.extend({
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),

  username() {
    return `${this.firstName}${this.lastName.charAt(0)}`.toLowerCase();
  },

  isStaff: true,
  isActive: true,
  isSuperuser: false,
  tourDone: true,

  afterCreate(user, server) {
    server.create("employment", { user });
    server.create("employment", "active", { user });

    server.db.absenceTypes.forEach(({ id: absenceTypeId }, i) => {
      server.create("absence-balance", i % 2 === 0 ? "days" : "duration", {
        user,
        absenceTypeId
      });
    });

    const days = [...new Array(10).keys()];

    days.forEach(i => {
      server.create("worktime-balance", {
        user,
        date: moment().subtract(i, "days")
      });
    });
  }
});

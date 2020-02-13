import { Factory, trait } from "ember-cli-mirage";
import faker from "faker";
import moment from "moment";

export default Factory.extend({
  comment: () => faker.lorem.sentence(),
  transferred: false,
  review: faker.random.boolean(),
  notBillable: faker.random.boolean(),
  // task: association(),

  date: () => moment(),

  fromTime() {
    return this.date.clone().format("HH:mm:ss");
  },

  toTime() {
    const start = moment(this.fromTime, "HH:mm:ss");

    return start
      .add(faker.random.number({ min: 15, max: 60 }), "minutes")
      .add(faker.random.number({ min: 0, max: 59 }), "seconds")
      .format("HH:mm:ss");
  },

  afterCreate(activity, server) {
    activity.update({ taskId: server.create("task").id });
    activity.update({
      duration: moment.duration(
        (activity.toTime ? moment(activity.toTime, "HH:mm:ss") : moment()).diff(
          moment(activity.fromTime, "HH:mm:ss")
        )
      )
    });
  },

  active: trait({
    toTime: null
  }),

  unknown: trait({
    afterCreate(activity) {
      activity.task.destroy();
    }
  }),

  defineTask: trait({
    afterCreate(activity) {
      activity.update({ taskId: activity.definedTask });
    }
  })
});

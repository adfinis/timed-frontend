import Service from "@ember/service";

const LOCAL_OVERRIDES = {
  activity: {
    comment: "",
  },
  customers: [],
  recentTasks: [],
};

class TrackingServiceStub extends Service {
  get activity() {
    return LOCAL_OVERRIDES.activity;
  }

  get customers() {
    return LOCAL_OVERRIDES.customers;
  }

  get recentTasks() {
    return LOCAL_OVERRIDES.recentTasks;
  }
}

export function setup(context, overrides) {
  context.owner.register("service:tracking", TrackingServiceStub);
  Object.keys(overrides).forEach((key) => {
    LOCAL_OVERRIDES[key] = overrides[key];
  });
}

export function teardown(context) {
  context.owner.unregister("service:tracking");
}

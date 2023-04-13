import Route from "@ember/routing/route";

export default class UsersIndexRoute extends Route {
  queryParams = {
    search: {
      refreshModel: true,
      replace: true,
    },
    supervisor: {
      refreshModel: true,
      replace: true,
    },
    active: {
      refreshModel: true,
      replace: true,
    },
    ordering: {
      refreshModel: true,
      replace: true,
    },
  };
}

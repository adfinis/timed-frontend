import Service, { inject as service } from "@ember/service";
import { isEmpty } from "@ember/utils";
import { isUnauthorizedResponse } from "ember-fetch/errors";
import { handleUnauthorized } from "ember-simple-auth-oidc";
import fetch from "fetch";

const CONTENT_TYPE = "application/vnd.api+json";

const cleanObject = (obj) => {
  return Object.entries(obj).reduce((clean, [key, value]) => {
    return {
      ...clean,
      ...(isEmpty(value) ? {} : { [key]: value }),
    };
  }, {});
};

const stringifyBodyData = (obj) => {
  if (!obj) {
    return "";
  }

  // assume the body is already stringyfied
  if (typeof obj !== "object") {
    return obj;
  }

  // push the data object into the request body
  const body = Object.entries(obj).reduce((body, [key, value]) => {
    if (key === "data") {
      return { ...body, data: { ...value } };
    }
    if (key === "body") {
      return { ...body, ...value };
    }
    return body;
  }, {});

  return JSON.stringify(body);
};

export default class FetchService extends Service {
  @service session;

  async fetch(resource, init = {}) {
    init.headers = cleanObject({
      ...this.headers,
      ...(init.headers || {}),
    });

    if (!!init?.method && init?.method !== "GET" && init?.method !== "HEAD") {
      init.body = stringifyBodyData(init);
    }

    const response = await fetch(resource, init);

    if (!response.ok) {
      if (isUnauthorizedResponse(response)) {
        return handleUnauthorized(this.session);
      }

      const contentType = response.headers.get("content-type");
      let body = "";

      if (/^application\/(vnd\.api+)?json$/.test(contentType)) {
        body = await response.json();
      } else if (contentType === "text/plain") {
        body = await response.text();
      }

      // throw an error containing a human readable message
      throw {
        response,
        body,
        error: new Error(
          `Fetch request to URL ${response.url} returned ${response.status} ${response.statusText}:\n\n${body}`
        ),
      };
    }
    // Return early when "No Content" response is given. Trying to parse JSON
    // from that would result in an error.
    if (response.status === 204) {
      /* istanbul ignore next */
      return await response.text();
    }

    return await response.json();
  }

  get headers() {
    const headers = {
      accept: CONTENT_TYPE,
      "content-type": CONTENT_TYPE,
    };

    if (this.token) {
      headers.authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  get token() {
    return this.session.data.authenticated?.access_token;
  }
}

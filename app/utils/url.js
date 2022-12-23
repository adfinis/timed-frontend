const notNullOrUndefined = (value) => value !== null && value !== undefined;

export const cleanParams = (params) =>
  Object.keys(params)
    .filter((key) => notNullOrUndefined(params[key]))
    .reduce((cleaned, key) => ({ ...cleaned, [key]: params[key] }), {});

export const toQueryString = (params) =>
  Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");

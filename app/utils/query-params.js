import { get } from "@ember/object";
import { underscore } from "@ember/string";

/**
 * Filter params by key
 */
export const filterQueryParams = (params, ...keys) => {
  return Object.keys(params).reduce((obj, key) => {
    return keys.includes(key) ? obj : { ...obj, [key]: get(params, key) };
  }, {});
};

/**
 * Underscore all object keys
 */
export const underscoreQueryParams = (params) => {
  return Object.keys(params).reduce((obj, key) => {
    return { ...obj, [underscore(key)]: get(params, key) };
  }, {});
};

export const serializeQueryParams = (params, queryParamsObject) => {
  return Object.keys(params).reduce((parsed, key) => {
    const serializeFn = get(queryParamsObject, key)?.serialize;
    const value = get(params, key);

    return key === "type"
      ? parsed
      : {
          ...parsed,
          [key]: serializeFn ? serializeFn(value) : value,
        };
  }, {});
};

/**
 *
 * @param {string} param
 * @returns {string} | {undefined}
 * ? in all controllers, the only parameter that have the default value is `ordering`, and the value is "-date"
 */
export function getDefaultQueryParamValue(param) {
  if (param === "ordering") return "-date";
  else if (param === "type") return "year";
  return undefined;
}

export function allQueryParams(controller) {
  const queries = {};
  for (const param of controller.queryParams) {
    queries[param] = controller[param];
  }
  return queries;
}

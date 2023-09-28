import { get } from "@ember/object";
import { underscore } from "@ember/string";
import {
  serializeMoment,
  deserializeMoment,
} from "timed/utils/serialize-moment";

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
  const params = {};
  for (const qpKey of controller.queryParams) {
    params[qpKey] = controller[qpKey];
  }
  return params;
}

export function queryParamsState(controller) {
  const states = {};
  for (const param of controller.queryParams) {
    const defaultValue = getDefaultQueryParamValue(param);
    const currentValue = controller[param];
    states[param] = {
      defaultValue,
      serializedValue: currentValue,
      value: currentValue,
      changed: currentValue !== defaultValue,
    };
    if (["fromDate", "toDate"].includes(param)) {
      states[param].serialize = serializeMoment;
      states[param].deserialize = deserializeMoment;
    }

    if (param === "id") {
      states[param].serialize = (arr) => {
        return (arr && Array.isArray(arr) && arr.join(",")) || null;
      };
      states[param].deserialize = (str) => {
        return (str && str.split(",")) || [];
      };
    }
    if (param === "ordering") {
      states[param].serialize = function (val) {
        if (!val) return;
        if (val.includes(",id")) {
          return val;
        }
        return `${val},id`;
      };
    }
  }
  return states;
}

export function resetQueryParams(controller, ...args) {
  if (!args[0]) {
    return;
  }
  const params = [...args[0]];
  for (const param of params) {
    controller[param] = getDefaultQueryParamValue(param);
  }
}

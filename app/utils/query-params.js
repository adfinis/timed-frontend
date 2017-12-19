import { get } from '@ember/object'
import { underscore } from '@ember/string'

/**
 * Filter params by key
 */
export const filterQueryParams = (params, ...keys) => {
  return Object.keys(params).reduce((obj, key) => {
    return keys.includes(key) ? obj : { ...obj, [key]: get(params, key) }
  }, {})
}

/**
 * Underscore all object keys
 */
export const underscoreQueryParams = params => {
  return Object.keys(params).reduce((obj, key) => {
    return { ...obj, [underscore(key)]: get(params, key) }
  }, {})
}

/**
 * Serialize a query param object with a given ember-parachute QueryParams object
 *
 * let queryParamsObject = new QueryParams({
 *   foo: {
 *     serialize: val => `test-${val}`
 *   }
 * })
 *
 * serializeParachuteQueryParams({ foo: 'bar' }).foo // will be 'test-bar'
 */
export const serializeParachuteQueryParams = (params, queryParamsObject) => {
  return Object.keys(params).reduce((parsed, key) => {
    let serializeFn = get(queryParamsObject, `queryParams.${key}.serialize`)
    let value = get(params, key)

    return key === 'type'
      ? parsed
      : {
          ...parsed,
          [key]: serializeFn ? serializeFn(value) : value
        }
  }, {})
}

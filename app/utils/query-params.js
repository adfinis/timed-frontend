import { get } from '@ember/object'
import { underscore } from '@ember/string'

export const underscoreQueryParams = params => {
  return Object.keys(params).reduce((obj, key) => {
    return { ...obj, [underscore(key)]: get(params, key) }
  }, {})
}

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

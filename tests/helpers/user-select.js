import { selectChoose } from 'ember-power-select/test-support/helpers'

export default async function userSelect(selector = '') {
  await selectChoose(
    `${selector} .user-select`,
    '.ember-power-select-option',
    0
  )
}

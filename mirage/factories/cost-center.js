import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  name: () => faker.finance.accountName(),
  reference: () => faker.finance.account()
})

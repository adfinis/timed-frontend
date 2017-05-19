import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  name: () => faker.address.city(),
  workdays: [ '1', '2', '3', '4', '5' ]
})

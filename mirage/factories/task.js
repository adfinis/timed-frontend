import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  name: faker.list.cycle('Technische Arbeit', 'Weg', 'Administration', 'Beratung & Planung', 'Nacht- & Wochenendarbeit'),
  estimatedTime: faker.list.random(50, 200, 300, 400, 500, 1000)
})

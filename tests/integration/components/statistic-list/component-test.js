import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | statistic list', function() {
  setupComponentTest('statistic-list', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#statistic-list}}
    //     template content
    //   {{/statistic-list}}
    // `);

    this.render(hbs`{{statistic-list}}`);
    expect(this.$()).to.have.length(1);
  });
});

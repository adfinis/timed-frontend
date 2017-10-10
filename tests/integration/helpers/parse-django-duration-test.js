import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Helper | parse django duration', function() {
  setupComponentTest('parse-django-duration', {
    integration: true
  });

  it('renders', function() {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    // Template block usage:
    // this.render(hbs`
    //   {{#parse-django-duration}}
    //     template content
    //   {{/parse-django-duration}}
    // `);
    this.set('inputValue', '1234');

    this.render(hbs`{{parse-django-duration inputValue}}`);

    expect(this.$().text().trim()).to.equal('1234');
  });
});


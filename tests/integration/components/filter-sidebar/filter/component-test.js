import { click, findAll, find, fillIn, render } from "@ember/test-helpers";
import { setupRenderingTest } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | filter sidebar/filter", function(hooks) {
  setupRenderingTest(hooks);

  test("works with type button", async function(assert) {
    this.setProperties({
      options: [
        { id: 1, label: "test 1" },
        { id: 2, label: "test 2" },
        { id: 3, label: "test 3" }
      ],
      selected: 2
    });

    await render(hbs`
      {{filter-sidebar/filter 'button'
        selected=selected
        options=options
        valuePath='id'
        labelPath='label'
        on-change=(action (mut selected))
      }}
    `);

    assert.dom("button").exists({ count: 3 });

    assert.deepEqual(
      findAll("button").map(b => b.innerHTML.trim()),
      ["test 1", "test 2", "test 3"]
    );

    assert.equal(find("button.active").innerHTML.trim(), "test 2");

    await click("button:nth-child(1)");

    assert.equal(this.get("selected"), 1);
  });

  test("works with type select", async function(assert) {
    this.setProperties({
      options: [
        { id: 1, label: "test 1" },
        { id: 2, label: "test 2" },
        { id: 3, label: "test 3" }
      ],
      selected: 2
    });

    await render(hbs`
      {{filter-sidebar/filter 'select'
        selected=selected
        options=options
        valuePath='id'
        labelPath='label'
        on-change=(action (mut selected))
      }}
    `);

    assert.dom("option").exists({ count: 3 });

    assert.deepEqual(
      findAll("option").map(b => b.innerHTML.trim()),
      ["test 1", "test 2", "test 3"]
    );
    assert.equal(
      findAll("option")[find("select").options.selectedIndex].innerHTML.trim(),
      "test 2"
    );

    await fillIn("select", "1");

    assert.equal(this.get("selected"), "1");
  });

  test("works with type date", async function(assert) {
    this.set("selected", moment({ year: 2017, month: 10, day: 1 }));

    await render(hbs`
      {{filter-sidebar/filter 'date'
        selected=selected
        on-change=(action (mut selected))
      }}
    `);

    assert.dom("input").hasValue(this.get("selected").format("DD.MM.YYYY"));

    await fillIn("input", "10.10.2010");

    assert.equal(
      this.get("selected").format(),
      moment({ year: 2010, month: 9, day: 10 }).format()
    );
  });

  test("works with type search", async function(assert) {
    this.set("selected", "foobar");

    await render(hbs`
      {{filter-sidebar/filter 'search'
        selected=selected
        on-change=(action (mut selected))
      }}
    `);

    assert.dom("input").hasValue(this.get("selected"));

    await fillIn("input", "foobarbaz");

    assert.equal(this.get("selected"), "foobarbaz");
  });

  test("works with block style", async function(assert) {
    await render(hbs`
      {{#filter-sidebar/filter}}
        Works
      {{/filter-sidebar/filter}}
    `);

    assert.dom("div").includesText("Works");
  });
});

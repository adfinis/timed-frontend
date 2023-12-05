import { click, findAll, find, fillIn, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | filter sidebar/filter", function (hooks) {
  setupRenderingTest(hooks);

  test("works with type button", async function (assert) {
    this.setProperties({
      options: [
        { id: 1, label: "test 1" },
        { id: 2, label: "test 2" },
        { id: 3, label: "test 3" },
      ],
      selected: 2,
    });

    await render(hbs`
      <FilterSidebar::Filter
        @type='button'
        @selected={{this.selected}}
        @options={{this.options}}
        @valuePath='id'
        @labelPath='label'
        @onChange={{fn (mut this.selected)}}
      />
    `);

    assert.dom("button").exists({ count: 3 });

    assert.deepEqual(
      findAll("button").map((b) => b.innerHTML.trim()),
      ["test 1", "test 2", "test 3"]
    );

    assert.strictEqual(find("button.active").innerHTML.trim(), "test 2");

    await click("button:nth-child(1)");

    assert.strictEqual(this.selected, 1);
  });

  test("works with type select", async function (assert) {
    this.setProperties({
      options: [
        { id: 1, label: "test 1" },
        { id: 2, label: "test 2" },
        { id: 3, label: "test 3" },
      ],
      selected: 2,
    });

    await render(hbs`
      <FilterSidebar::Filter
        @type='select'
        @selected={{this.selected}}
        @options={{this.options}}
        @valuePath='id'
        @labelPath='label'
        @onChange={{fn (mut this.selected)}}
      />
    `);

    assert.dom("option").exists({ count: 3 });

    assert.deepEqual(
      findAll("option").map((b) => b.innerHTML.trim()),
      ["test 1", "test 2", "test 3"]
    );
    assert.strictEqual(
      findAll("option")[find("select").options.selectedIndex].innerHTML.trim(),
      "test 2"
    );

    await fillIn("select", "1");

    assert.strictEqual(this.selected, "1");
  });

  test("works with type date", async function (assert) {
    this.set("selected", moment({ year: 2017, month: 10, day: 1 }));

    await render(hbs`
      <FilterSidebar::Filter
        @type='date'
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
      />
    `);

    assert.dom("input").hasValue(this.selected.format("DD.MM.YYYY"));

    await fillIn("input", "10.10.2010");

    assert.strictEqual(
      this.selected.format(),
      moment({ year: 2010, month: 9, day: 10 }).format()
    );
  });

  test("works with type search", async function (assert) {
    this.set("selected", "foobar");

    await render(hbs`
      <FilterSidebar::Filter
        @type='search'
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
      />
    `);

    assert.dom("input").hasValue(this.selected);

    await fillIn("input", "foobarbaz");

    assert.strictEqual(this.selected, "foobarbaz");
  });

  test("works with block style", async function (assert) {
    await render(hbs`
      <FilterSidebar::Filter>
        Works
      </FilterSidebar::Filter>
    `);

    assert.dom("div").includesText("Works");
  });
});

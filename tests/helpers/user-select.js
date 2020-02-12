import { selectChoose } from "ember-power-select/test-support";

export default async function(selector = "") {
  await selectChoose(
    `${selector} .user-select`,
    ".ember-power-select-option",
    0
  );
}

import faker from "faker";
import moment from "moment";
import DjangoDurationTransform from "timed/transforms/django-duration";

export function randomDuration(precision = 15, seconds = false, maxHours = 2) {
  const h = faker.random.number({ max: maxHours });
  const m = Math.abs(
    Math.ceil(faker.random.number({ min: 0, max: 60 }) / precision) * precision
  );
  const s = Math.abs(seconds ? faker.random.number({ max: 59, min: 0 }) : 0);

  return DjangoDurationTransform.create().serialize(
    moment.duration({ h, m, s })
  );
}

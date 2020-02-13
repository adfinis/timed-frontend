import validateIntersectionTask from "timed/validators/intersection-task";
import validateNullOrNotBlank from "timed/validators/null-or-not-blank";

export default {
  task: validateIntersectionTask(),
  comment: validateNullOrNotBlank()
};

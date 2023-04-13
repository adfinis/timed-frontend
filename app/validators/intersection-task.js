export default function validateIntersectionTask() {
  return (key, newValue, oldValue, changes, content) => {
    const customerChanged =
      Object.keys(changes).includes("customer") &&
      (changes.customer.id || null) !== (content.customer.id || null);

    const projectChanged =
      Object.keys(changes).includes("project") &&
      (changes.project.id || null) !== (content.project.id || null);

    const hasTask = !!(newValue && newValue.id);

    return (
      hasTask ||
      (!hasTask && !customerChanged && !projectChanged) ||
      "Task must not be empty"
    );
  };
}

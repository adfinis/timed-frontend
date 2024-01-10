export default function validateIntersectionTask() {
  return (key, newValue, oldValue, changes, content) => {
    const customerChanged =
      Object.keys(changes).includes("customer") &&
      (changes.customer?.get("id") || null) !==
        (content.customer?.get("id") || null);

    const projectChanged =
      Object.keys(changes).includes("project") &&
      (changes.project?.get("id") || null) !==
        (content.project?.get("id") || null);

    const hasTask = !!(newValue && newValue.id);

    return (
      hasTask ||
      (!hasTask && !customerChanged && !projectChanged) ||
      "Task must not be empty"
    );
  };
}

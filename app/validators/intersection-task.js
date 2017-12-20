import { get } from '@ember/object'

export default function validateIntersectionTask() {
  return (key, newValue, oldValue, changes, content) => {
    let customerChanged =
      Object.keys(changes).includes('customer') &&
      (get(changes, 'customer.id') || null) !==
        (get(content, 'customer.id') || null)

    let projectChanged =
      Object.keys(changes).includes('project') &&
      (get(changes, 'project.id') || null) !==
        (get(content, 'project.id') || null)

    let hasTask = !!(newValue && get(newValue, 'id'))

    return (
      hasTask ||
      (!hasTask && !customerChanged && !projectChanged) ||
      'Task must not be empty'
    )
  }
}

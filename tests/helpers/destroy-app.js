import { run } from 'ember-runtime'

export default function destroyApp(application) {
  run(application, 'destroy')
}

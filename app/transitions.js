/* eslint-disable require-jsdoc */
export default function() {
  this.transition(
    this.fromRoute('users.edit.index'),
    this.toRoute('users.edit.credits'),
    this.use('toLeft'),
    this.reverse('toRight')
  )
}

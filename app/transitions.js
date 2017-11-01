/* eslint-disable require-jsdoc */
export default function() {
  this.transition(
    this.fromRoute('users.edit.index'),
    this.toRoute('users.edit.credits'),
    this.use('toLeft'),
    this.reverse('toRight')
  )

  this.transition(
    this.fromRoute('users.edit.index'),
    this.toRoute('users.edit.responsibilities'),
    this.use('toLeft'),
    this.reverse('toRight')
  )

  this.transition(
    this.fromRoute('users.edit.credits'),
    this.toRoute('users.edit.responsibilities'),
    this.use('toLeft'),
    this.reverse('toRight')
  )
}

# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots[
    "test_report_notify_rendering 1"
] = """
Some of your reports have been changed.

Reviewer: Test User


Date: 11/13/1983
Duration: 0:15 (h:mm)
Task: Marsh, Gonzalez and Michael > Intuitive coherent hardware > LLC
Comment: some other comment

* Not_Billable
  [old] True
  [new] False

---

Date: 07/10/1985
Duration: 2:30 (h:mm)

Comment: some other comment

* Task
  [old] Marsh, Gonzalez and Michael > Intuitive coherent hardware > and Sons
  [new] Marsh, Gonzalez and Michael > Intuitive coherent hardware > LLC

---

Date: 06/01/1999
Duration: 3:15 (h:mm)



* Task
  [old] Marsh, Gonzalez and Michael > Intuitive coherent hardware > LLC
  [new] Marsh, Gonzalez and Michael > Intuitive coherent hardware > LLC

* Comment
  [old] foo
  [new] some other comment

---

Date: 10/26/2002
Duration: 1:00 (h:mm)
Task: Marsh, Gonzalez and Michael > Intuitive coherent hardware > LLC


* Comment
  [old] original comment
  [new] some other comment

---
"""

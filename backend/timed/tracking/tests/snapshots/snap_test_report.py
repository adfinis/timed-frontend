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


Date: 10/03/1998
Duration: 3:15 (h:mm)



* Task
  [old] Allen Inc > Cross-platform content-based synergy > and Sons
  [new] Allen Inc > Cross-platform content-based synergy > LLC

* Comment
  [old] foo
  [new] some other comment

---

Date: 05/27/2000
Duration: 2:30 (h:mm)

Comment: some other comment

* Task
  [old] Allen Inc > Cross-platform content-based synergy > Ltd
  [new] Allen Inc > Cross-platform content-based synergy > LLC

---

Date: 04/20/2005
Duration: 0:15 (h:mm)
Task: Allen Inc > Cross-platform content-based synergy > LLC
Comment: some other comment

* Not_Billable
  [old] True
  [new] False

---

Date: 03/23/2016
Duration: 1:00 (h:mm)
Task: Allen Inc > Cross-platform content-based synergy > LLC


* Comment
  [old] original comment
  [new] some other comment

---
"""

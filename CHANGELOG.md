## [3.0.2](https://github.com/adfinis/timed-frontend/compare/v3.0.1...v3.0.2) (2023-03-03)


### Bug Fixes

* **activity-edit-form:** update task selection on model change ([72815a2](https://github.com/adfinis/timed-frontend/commit/72815a2dce3aed6edcd728687b95e2dc01f4d650))
* **bulk-report-edit:** reset query params after exit ([89bef0c](https://github.com/adfinis/timed-frontend/commit/89bef0c737ca08ba92ef3f6893d1f47d349d6c8c))
* **bulk-report-edit:** show change warning only if changed ([b210014](https://github.com/adfinis/timed-frontend/commit/b210014fc274e6b23ee57f9d00f6fc6b611d9916))
* **font-awesome:** add missing calendar-plus icon ([f8a0a7f](https://github.com/adfinis/timed-frontend/commit/f8a0a7f6d7de49f5add29204cfe2d534dd77a1d7))
* **progress-tooltip:** respect remaing effort flag ([0ff1cb8](https://github.com/adfinis/timed-frontend/commit/0ff1cb8c1df0c3f23c966647355952687c1f2d5d))
* **projects:** modifying estimated time without sideeffects ([ca5b08b](https://github.com/adfinis/timed-frontend/commit/ca5b08b5cf2c44838b1ac232478e03bf08ef405b))
* **reports:** fetch available customers if no pre-selection is given ([9449d76](https://github.com/adfinis/timed-frontend/commit/9449d76aaeb3d003761f439fd995a5a4e476b732))
* **reports:** include user to resolve name of verifier ([8de845e](https://github.com/adfinis/timed-frontend/commit/8de845e037146c8b4a5e85e32573fc7dad7ea0f8))
* **sy-durationpicker:** allow equal to max and min values ([6cac404](https://github.com/adfinis/timed-frontend/commit/6cac4046e7e77b13ceadf0c47b186f11cb8bd6e8))
* **task-selection:** fetch projects if customer is given ([452c467](https://github.com/adfinis/timed-frontend/commit/452c467ef2ca0401225af418fd03f52b4c81c056))
* **weekly-overview:** refresh weekly overview graph ([733bc5c](https://github.com/adfinis/timed-frontend/commit/733bc5cf29b4e1bc9e9177135671046b2daefff9))

## [2.1.3](https://github.com/adfinis-sygroup/timed-frontend/compare/v2.1.2...v2.1.3) (2022-06-23)


### Bug Fixes

* **index:** rename type to absence_type ([9d369f4](https://github.com/adfinis-sygroup/timed-frontend/commit/9d369f47312759498630b0bee4ff5b17e4b4ec61))

## [2.1.2](https://github.com/adfinis-sygroup/timed-frontend/compare/v2.1.1...v2.1.2) (2022-03-02)


### Bug Fixes

* **auth:** invalidate session on HTTP 401 ([2014ea2](https://github.com/adfinis-sygroup/timed-frontend/commit/2014ea29a21051ae2f59c786413e6cfa081c1681))

# [2.1.0](https://github.com/adfinis-sygroup/timed-frontend/compare/v2.0.4...v2.1.0) (2021-12-21)


### Features

* create view for users with no permission ([85ea184](https://github.com/adfinis-sygroup/timed-frontend/commit/85ea1846c87dabcc4ed900e106b17429dd1fbc32))

## [2.0.4](https://github.com/adfinis-sygroup/timed-frontend/compare/v2.0.3...v2.0.4) (2021-11-25)


### Bug Fixes

* **styling:** fix overlapping eye-icon in comment field ([b8eceb2](https://github.com/adfinis-sygroup/timed-frontend/commit/b8eceb2e5f608caea51fa4a7c4550eeb0592db45))

## [2.0.3](https://github.com/adfinis-sygroup/timed-frontend/compare/v2.0.2...v2.0.3) (2021-10-19)


### Bug Fixes

* **analysis:** rewrite to angle brackets ([e32e0ec](https://github.com/adfinis-sygroup/timed-frontend/commit/e32e0ec8120dd861b9f3c260039371e8b54627ae))
* **analysis:** show sensible messages ([7a548eb](https://github.com/adfinis-sygroup/timed-frontend/commit/7a548eba368805a4aef8068c033377a27f85799f))
* **tests:** enable previously skipped test ([b592aa8](https://github.com/adfinis-sygroup/timed-frontend/commit/b592aa83f6b0326dea3f285c31fda16aa7cff633))

# v1.3.0 (12 August 2021)

### Feature
* Refactor reviewers to use assignees with reviewer role ([`0de9e48`](https://github.com/adfinis-sygroup/timed-frontend/commit/0de9e4835800dd2ffd30c2d9dc6fbbda21a62870))
* Disable items for external employees ([`ecc2407`](https://github.com/adfinis-sygroup/timed-frontend/commit/ecc2407aec76fd3f3d5b96c27c68cb0ffdcbfc27))
* Add a customer visible icon in the comments ([`186fff0`](https://github.com/adfinis-sygroup/timed-frontend/commit/186fff0d76b161f48a4c40dec627a1c8fac6e94a))


# v1.2.0 (16 April 2021)

### Feature
* **report:** Implement billed permissions ([`5b707bb`](https://github.com/adfinis-sygroup/timed-frontend/commit/5b707bb82a174f17125978b637b81199554c6702))
* **statistics:** Add billed flag to statistics filter ([`53a7830`](https://github.com/adfinis-sygroup/timed-frontend/commit/53a78300ec2fb3a634ce17cbe9cd722cd629720e))
* **analysis:** Add billed flag to analysis ([`b6cd007`](https://github.com/adfinis-sygroup/timed-frontend/commit/b6cd007820c956e6fdc7f9f46f492ee5c66f783f))
* **models:** Add billed flag to report models ([`c64ba39`](https://github.com/adfinis-sygroup/timed-frontend/commit/c64ba39800757a33636e0670846b078c5bbdafd4))
* Add progress percentage for billable time and remove bottom progress bar in the progress tooltip ([`2857d0e`](https://github.com/adfinis-sygroup/timed-frontend/commit/2857d0e6a98db037afc46f0508818a6c767df06d))

### Fix
* **report:** Disable deletion of verfied reports ([`63a67ae`](https://github.com/adfinis-sygroup/timed-frontend/commit/63a67aed9e029aee903891cd680785889e425101))
* **report:** Fix report permissions and tests ([`fa9386b`](https://github.com/adfinis-sygroup/timed-frontend/commit/fa9386bf1c8762862db223972c66b4558e3f2872))


# v1.1.2 (28 October 2020)

* Revert unnecessary error handling for invalid token. This is handled by ember-simple-auth.


# v1.1.1 (20 August 2020)

* Improved error handling in case of authentication failure


# v1.1.0 (11 August 2020)

* README: Update readme according to docker setup


# v1.0.0 (30 July 2020)

See Github releases for changelog of previous versions.

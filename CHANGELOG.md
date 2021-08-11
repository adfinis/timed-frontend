# v1.2.0 (11 August 2021)

### Feature
* Use assignees with reviewer role instead of reviewers ([`89def71`](https://github.com/adfinis-sygroup/timed-backend/commit/89def71eefc0f18e7989b34f882acd2fd619998d))
* Rewrite permissions and visibilty to use with assignees and external employees ([`159e750`](https://github.com/adfinis-sygroup/timed-backend/commit/159e75033ed4c477d56f2a2817dee82b3066d2a9))
* Add user assignement to customers, projects and tasks ([`6ff4259`](https://github.com/adfinis-sygroup/timed-backend/commit/6ff425941307a0386d835187eaad02e26cc718e3))
* Export metrics with django-prometheus ([`6ed9cab`](https://github.com/adfinis-sygroup/timed-backend/commit/6ed9cabeeefd2e6945a63b83de1ee85018fb56a5))
* Add and enable sentry-sdk for error reporting ([`1e96b78`](https://github.com/adfinis-sygroup/timed-backend/commit/1e96b785206ddd1a871e5b23a9126f50c94c38dc))
* Show not_billable and review attributes for reports in weekly report ([`a02aca4`](https://github.com/adfinis-sygroup/timed-backend/commit/a02aca48ae609f9ac514238be723c056fa60754f))
* Add customer_visible field to project serializer ([`2f12f86`](https://github.com/adfinis-sygroup/timed-backend/commit/2f12f86d6132c1362d7065ad0fd8cf89a4f4f377))
* Add billed flag to project and tracking ([`fe41199`](https://github.com/adfinis-sygroup/timed-backend/commit/fe41199527e5ab37f23c715d844805b7d8944d64))
* **employment:** Add new attribute is_external to employment model ([`e8e6291`](https://github.com/adfinis-sygroup/timed-backend/commit/e8e629193b7aabd592fc9744bc7210577d58c910))
* **projects:** Add currency fields to task and project ([`7266c34`](https://github.com/adfinis-sygroup/timed-backend/commit/7266c346236e9e0d1c83d9f84b99a4e782256ba4))
* **runtime:** Use gunicorn instead of uwsgi ([`e6b1fdf`](https://github.com/adfinis-sygroup/timed-backend/commit/e6b1fdfc5bb2ad5578ed2927ee210b5da2119f9b))
* **redmine:** Update template formatting ([`9b1a6f1`](https://github.com/adfinis-sygroup/timed-backend/commit/9b1a6f164f72c2eae57a1e20cc0cff763c7e535a))

### Fix
* Translate work report to English ([`7a87d93`](https://github.com/adfinis-sygroup/timed-backend/commit/7a87d935893dbc68fd59a4fb477691ad209b6a3b))
* Update workreport template ([`b877194`](https://github.com/adfinis-sygroup/timed-backend/commit/b87719485affd6421734251c270d1fbeb37a7176))
* Add custom forms for supervisor and supervisee inlines ([`b92799d`](https://github.com/adfinis-sygroup/timed-backend/commit/b92799d66759479827cf11f958c12d55d9c8d5bd))
* Add billable column and calculate not billable time ([`4184b76`](https://github.com/adfinis-sygroup/timed-backend/commit/4184b76c66b5233d7a568cc6e37d9112ae9d939f))
* **tracking:** Set billed from project on report ([`d25e64f`](https://github.com/adfinis-sygroup/timed-backend/commit/d25e64fd4c898757acb565996173f460f636c6a6))
* **tracking:** Update billed if not sent with request ([`62295ba`](https://github.com/adfinis-sygroup/timed-backend/commit/62295bac19f302fa45281a72edb09397e3cbc4c6))
* Add test data users to keycloak config ([`082ef6e`](https://github.com/adfinis-sygroup/timed-backend/commit/082ef6e14a406a5d3b1a5f286007169689c0cb1b))

# v1.1.2 (28 October 2020)

### Fix
* fix user based permissions to use the IS_AUTHENTICATED permission properly (#654)


# v1.1.1 (14 August 2020)

### Fix
* increase uwsgi buffer-size for big query strings


# v1.1.0 (11 August 2020)

### Feature
* implement SSO OIDC login for django admin
* django-local user/password (django-admin) login is now a toggable setting, see `DJANGO_ALLOW_LOCAL_LOGIN`


# v1.0.0 (30 July 2020)

See Github releases for changelog of previous versions.

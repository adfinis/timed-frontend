# Timed Backend
[![Build Status](https://img.shields.io/travis/adfinis-sygroup/timed-backend.svg?style=flat-square)](https://travis-ci.org/adfinis-sygroup/timed-backend)
[![Coverage](https://img.shields.io/coveralls/adfinis-sygroup/timed-backend.svg?style=flat-square)](https://coveralls.io/github/adfinis-sygroup/timed-backend)
[![License](https://img.shields.io/github/license/adfinis-sygroup/timed-frontend.svg?style=flat-square)](LICENSE)

Timed timetracking software REST API built with Django

## Installation
**Requirements**
* Python 3.5.1
* docker
* docker-compose

After installing and configuring those requirements, you should be able to run the following
commands to complete the installation:
```bash
$ make install                 # Install Python requirements
$ docker-compose up -d         # Start the containers
$ make setup-ldap              # Configure UCS LDAP container
$ make create-ldap-user        # Create a new standard user
$ ./manage.py migrate          # Run Django migrations
$ ./manage.py createsuperuser  # Create a new Django superuser
```

You can now access the API at http://localhost:8000/api/v1 and the admin panel at http://localhost:8000/admin/

## Testing
Run tests by executing `make test`

## License
Code released under the [GNU Affero General Public License v3.0](LICENSE).

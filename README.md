# Timed (Backend)
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
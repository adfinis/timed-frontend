.PHONY: setup-ldap create-ldap-user

install:
	pip install -e .

test: test-lint test-coverage

test-coverage:
	py.test --cov

test-lint:
	flake8

setup-ldap:
	docker exec -it timedbackendsrc_ucs_1 /usr/lib/univention-system-setup/scripts/setup-join.sh
	docker exec -it timedbackendsrc_ucs_1 /usr/ucs/scripts/init.sh

create-ldap-user:
	docker exec -it timedbackendsrc_ucs_1 /usr/ucs/scripts/create-new-user.sh

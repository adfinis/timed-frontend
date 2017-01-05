.PHONY: help install install-dev setup-ldap create-ldap-user start test
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -k 1,1 | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install production environment
	@pip install --upgrade -r requirements.txt
	@pip install --upgrade .

install-dev: ## Install development environment
	@pip install --upgrade -r requirements.txt
	@pip install --upgrade -r dev_requirements.txt
	@pip install -e .

setup-ldap: ## Setup the LDAP container
	docker exec -it timedbackendsrc_ucs_1 /usr/lib/univention-system-setup/scripts/setup-join.sh
	docker exec -it timedbackendsrc_ucs_1 /usr/ucs/scripts/init.sh

create-ldap-user: ## Create a new user in the LDAP
	docker exec -it timedbackendsrc_ucs_1 /usr/ucs/scripts/create-new-user.sh

start: ## Start the development server
	@docker-compose start
	@python manage.py runserver

docs:
	@make -C docs html

test: ## Test the project
	@flake8
	@pytest --cov --create-db

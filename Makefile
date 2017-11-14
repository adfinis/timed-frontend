.PHONY: help install install-dev setup-ldap create-ldap-user start docs test
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -k 1,1 | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install production environment
	@pip install --upgrade pip
	@pip install --upgrade requirements.txt

install-dev: ## Install development environment
	@pip install --upgrade pip
	@pip install --upgrade -r requirements.txt -r dev_requirements.txt

start: ## Start the development server
	@docker-compose start db
	@python manage.py runserver

test: ## Test the project
	./manage.py migrate --noinput
	./manage.py makemigrations --check --dry-run --noinput
	@flake8
	@pytest --no-cov-on-fail --cov --create-db

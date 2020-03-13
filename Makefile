.PHONY: help start test shell loaddata
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -k 1,1 | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start: ## Start the development server
	@docker-compose up -d --build
	@make loaddata

test: ## Test the project
	@docker-compose exec backend sh -c "black --check . && flake8 && pytest --no-cov-on-fail --cov --create-db"

shell: ## Shell into the backend
	@docker-compose exec backend bash

loaddata: ## Loads test data into the database
	@docker-compose exec backend ./manage.py loaddata timed/fixtures/test_data.json

.DEFAULT_GOAL := help

.PHONY: help dev dev-build test test-backend test-frontend lint clean

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start all services
	docker compose up

dev-build: ## Rebuild and start
	docker compose up --build

test: test-backend test-frontend ## Run all tests

test-backend: ## Run backend tests
	cd backend && python -m pytest tests/ --cov=app --cov-report=term-missing -v

test-frontend: ## Run frontend tests
	cd frontend && npm test

lint: ## Lint all code
	cd backend && ruff check . && ruff format --check .
	cd frontend && npm run lint

clean: ## Stop and remove volumes
	docker compose down -v

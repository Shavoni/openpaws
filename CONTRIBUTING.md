# Contributing to OpenPaws

## Setup
1. Clone and copy `.env.example` to `.env`
2. Run `make dev-build`
3. API: http://localhost:8000/docs | Frontend: http://localhost:3000

## Standards
- Python 3.12+, type hints, ruff linting
- TypeScript strict, ESLint + Prettier
- Tests: >80% coverage, TDD approach

## PR Process
1. Branch from `develop`
2. Write tests first
3. Ensure `make lint && make test` pass
4. Use conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`

.PHONY: build run test clean docker-up docker-down deps

# Build the application
build:
	go build -o bin/main main.go

# Run the application
run:
	go run main.go

# Install dependencies
deps:
	go mod download
	go mod tidy

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Docker commands
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-build:
	docker-compose build

# Database commands
db-up:
	docker-compose up -d db

db-down:
	docker-compose stop db

db-reset:
	docker-compose down db
	docker volume rm rent-contracts_db-data
	docker-compose up -d db

# Development commands
dev:
	go run main.go

format:
	go fmt ./...

lint:
	golangci-lint run

# Help
help:
	@echo "Available commands:"
	@echo "  build       - Build the application"
	@echo "  run         - Run the application"
	@echo "  deps        - Install dependencies"
	@echo "  test        - Run tests"
	@echo "  clean       - Clean build artifacts"
	@echo "  docker-up   - Start all services with Docker"
	@echo "  docker-down - Stop all services"
	@echo "  docker-logs - View logs"
	@echo "  db-up       - Start only database"
	@echo "  db-down     - Stop only database"
	@echo "  db-reset    - Reset database"
	@echo "  dev         - Run in development mode"
	@echo "  format      - Format code"
	@echo "  lint        - Run linter"

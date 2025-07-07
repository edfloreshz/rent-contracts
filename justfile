# justfile for rent-contracts

# Build the application
build:
	go build -o bin/main src/main.go

# Run the application
run:
	respec . -o openapi.yaml
	go run src/main.go

# Install dependencies
deps:
	cd src && go mod download && go mod tidy

# Run tests
test:
	cd src && go test ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Docker commands
up:
	docker compose up -d --no-deps --build

down:
	docker compose down

web:
	cd web && deno run dev
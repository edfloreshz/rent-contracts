# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum openapi.yaml ./
RUN go mod download

# Copy source code
COPY src/ ./src/

# Build the application
WORKDIR /app/src
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/main main.go

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests and curl for healthcheck
RUN apk --no-cache add ca-certificates curl

WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/openapi.yaml .

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]

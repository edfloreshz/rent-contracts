# Rent Contracts API

A REST API for managing rent contracts, users, and addresses using Go, Gin framework, GORM, and PostgreSQL.

## Features

- **Address Management**: Create, read, update, and delete addresses
- **User Management**: Manage tenants, admins, and references
- **Contract Management**: Handle rental contracts with versioning
- **Contract Versions**: Track different versions of contracts
- **Contract References**: Link references to contracts
- **Pagination**: List endpoints support pagination
- **Soft Deletes**: Records are soft-deleted using GORM's DeletedAt field
- **Auto-Migration**: GORM automatically creates/updates database schema
- **Relationships**: Preloaded relationships for efficient queries

## API Endpoints

### Health Check
- `GET /health` - API health check

### Addresses
- `POST /api/v1/addresses` - Create a new address
- `GET /api/v1/addresses` - List addresses (supports pagination and filtering)
- `GET /api/v1/addresses/:id` - Get address by ID
- `PUT /api/v1/addresses/:id` - Update address
- `DELETE /api/v1/addresses/:id` - Delete address (soft delete)

### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - List users (supports pagination and filtering)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (soft delete)

### Contracts
- `POST /api/v1/contracts` - Create a new contract
- `GET /api/v1/contracts` - List contracts (supports pagination and filtering)
- `GET /api/v1/contracts/:id` - Get contract by ID
- `DELETE /api/v1/contracts/:id` - Delete contract (soft delete)

### Contract Versions
- `POST /api/v1/contracts/versions` - Create a new contract version
- `GET /api/v1/contracts/:id/versions` - Get all versions of a contract

### Contract References
- `POST /api/v1/contracts/:id/references/:reference_id` - Add reference to contract
- `DELETE /api/v1/contracts/:id/references/:reference_id` - Remove reference from contract
- `GET /api/v1/contracts/:id/references` - Get all references for a contract

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Filtering
- `type` - Filter by type (for addresses and users)
- `tenant_id` - Filter contracts by tenant ID

## Example Requests

### Create Address
```bash
curl -X POST http://localhost:8080/api/v1/addresses \
  -H "Content-Type: application/json" \
  -d '{
    "type": "property",
    "street": "123 Main St",
    "number": "123",
    "neighborhood": "Downtown",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }'
```

### Create User
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tenant",
    "addressId": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }'
```

### Create Contract
```bash
curl -X POST http://localhost:8080/api/v1/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "550e8400-e29b-41d4-a716-446655440001",
    "addressId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Create Contract Version
```bash
curl -X POST http://localhost:8080/api/v1/contracts/versions \
  -H "Content-Type: application/json" \
  -d '{
    "contractId": "550e8400-e29b-41d4-a716-446655440002",
    "deposit": 2000.00,
    "rent": 1500.00,
    "rentIncreasePercentage": 3.5,
    "business": "ABC Real Estate Co.",
    "status": "active",
    "type": "yearly",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z"
  }'
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=rent_contracts
DB_SSLMODE=disable
PORT=8080
GIN_MODE=release
```

## Technology Stack

- **Go 1.22+**: Modern, fast programming language
- **Gin**: High-performance HTTP web framework
- **GORM**: Feature-rich ORM for Go
- **PostgreSQL**: Robust relational database
- **Docker**: Containerization for easy deployment

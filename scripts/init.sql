CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE ContractStatus AS ENUM (
	'active',
	'expired',
	'terminated'
);

CREATE TYPE ContractType AS ENUM (
	'yearly'
);

CREATE TYPE UserType AS ENUM (
	'admin',
	'tenant',
	'reference'
);

CREATE TYPE AddressType AS ENUM (
	'property',
	'tenant',
	'reference'
);

CREATE TABLE addresses (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	type AddressType NOT NULL,
	street TEXT NOT NULL,
	number TEXT NOT NULL,
	neighborhood TEXT NOT NULL,
	city TEXT NOT NULL,
	state TEXT NOT NULL,
	zipCode TEXT NOT NULL,
	country TEXT NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP,
	deletedAt TIMESTAMP,
	PRIMARY KEY(id)
);

CREATE TABLE users (
	id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
	type UserType NOT NULL,
	addressId UUID NOT NULL,
	firstName TEXT NOT NULL,
	middleName TEXT,
	lastName TEXT NOT NULL,
	email TEXT NOT NULL,
	phone TEXT NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP,
	deletedAt TIMESTAMP,
	PRIMARY KEY(id)
);

CREATE TABLE contracts (
    id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    currentVersionId UUID,
    landlordId UUID NOT NULL,
    tenantId UUID NOT NULL,
    addressId UUID NOT NULL,
    deposit NUMERIC NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE contractVersions (
    id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    contractId UUID NOT NULL,
    versionNumber INTEGER NOT NULL,
    rent NUMERIC NOT NULL,
    rentIncreasePercentage NUMERIC NOT NULL,
    business TEXT NOT NULL,
    status ContractStatus NOT NULL,
    type ContractType NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    renewalDate DATE,
    specialTerms TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(contractId) REFERENCES contracts(id) ON DELETE CASCADE,
    UNIQUE(contractId, versionNumber)
);

CREATE TABLE contractReferences (
	contractId UUID NOT NULL,
	referenceId UUID NOT NULL,
	PRIMARY KEY(contractId, referenceId)
);

ALTER TABLE contractVersions
ADD CONSTRAINT fk_contract_versions_contract FOREIGN KEY(contractId) REFERENCES contracts(id) ON DELETE CASCADE,
ADD CONSTRAINT check_valid_dates CHECK (startDate < endDate),
ADD CONSTRAINT check_percentage CHECK (rentIncreasePercentage >= 0 AND rentIncreasePercentage <= 100),
ADD CONSTRAINT check_positive_amounts CHECK (rent > 0),
ADD CONSTRAINT check_version CHECK (versionNumber > 0);

ALTER TABLE contracts
ADD CONSTRAINT fk_contracts_current_version FOREIGN KEY(currentVersionId) REFERENCES contractVersions(id) ON DELETE RESTRICT,
ADD CONSTRAINT fk_contracts_tenant FOREIGN KEY(tenantId) REFERENCES users(id) ON DELETE RESTRICT,
ADD CONSTRAINT fk_contracts_landlord FOREIGN KEY(landlordId) REFERENCES users(id) ON DELETE RESTRICT,
ADD CONSTRAINT check_positive_amounts CHECK (deposit >= 0),
ADD CONSTRAINT fk_contracts_address FOREIGN KEY(addressId) REFERENCES addresses(id) ON DELETE RESTRICT;

ALTER TABLE contractReferences
ADD CONSTRAINT fk_contract_references_reference FOREIGN KEY(referenceId) REFERENCES users(id) ON DELETE RESTRICT,
ADD CONSTRAINT fk_contract_references_contract FOREIGN KEY(contractId) REFERENCES contracts(id) ON DELETE CASCADE;

ALTER TABLE users
ADD CONSTRAINT fk_users_address FOREIGN KEY(addressId) REFERENCES addresses(id) ON DELETE RESTRICT;

CREATE INDEX idx_contracts_tenant ON contracts(tenantId) WHERE deletedAt IS NULL;
CREATE INDEX idx_contracts_landlord ON contracts(landlordId) WHERE deletedAt IS NULL;
CREATE INDEX idx_contract_versions_status ON contractVersions(status);
CREATE INDEX idx_contract_versions_dates ON contractVersions(startDate, endDate);
CREATE INDEX idx_contract_versions_contract_status ON contractVersions(contractId, status);
CREATE INDEX idx_contract_versions_contract_id ON contractVersions(contractId);
CREATE INDEX idx_contract_versions_version_number ON contractVersions(contractId, versionNumber);
CREATE INDEX idx_addresses_type ON addresses(type) WHERE deletedAt IS NULL;
CREATE INDEX idx_users_type ON users(type) WHERE deletedAt IS NULL;
CREATE UNIQUE INDEX idx_users_email_active ON users(email) WHERE deletedAt IS NULL;

-- Function to update the updatedAt timestamp on update
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updatedAt = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to set the current version when a new version is added
CREATE OR REPLACE FUNCTION update_contract_current_version()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE contracts
    SET currentVersionId = NEW.id, updatedAt = CURRENT_TIMESTAMP
    WHERE id = NEW.contractId;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate the next version number
CREATE OR REPLACE FUNCTION next_contract_version(contract_id UUID)
RETURNS INTEGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    SELECT COALESCE(MAX(versionNumber), 0) + 1 INTO next_version
    FROM contractVersions
    WHERE contractId = contract_id;
    
    RETURN next_version;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updatedAt timestamp on update
CREATE TRIGGER update_contracts_timestamp BEFORE UPDATE ON contracts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Trigger to update the updatedAt timestamp on update
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Trigger to update the updatedAt timestamp on update
CREATE TRIGGER update_addresses_timestamp BEFORE UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Trigger to update the current version
CREATE TRIGGER set_current_version
AFTER INSERT ON contractVersions
FOR EACH ROW EXECUTE FUNCTION update_contract_current_version();

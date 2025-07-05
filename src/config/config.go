package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	Port        string
	Environment string
}

func New() *Config {
	return &Config{
		DatabaseURL: GetEnv("DATABASE_URL", "postgres://postgres:postgres@db/rent-contracts?sslmode=disable"),
		Port:        GetEnv("PORT", "8080"),
		Environment: GetEnv("ENVIRONMENT", "development"),
	}
}

func GetEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

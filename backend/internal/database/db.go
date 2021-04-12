package database

import (
	"context"
	"database/sql"
	"log"

	"github.com/jackc/pgx/stdlib"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pressly/goose"

	"github.com/TritonSE/words-alive/internal/utils"
)

// Connects to the database and returns a pool of connections
func GetConnection() *pgxpool.Pool {
	dbUrl := utils.GetEnv("DATABASE_URL", "postgresql://postgres@localhost:5432/postgres")
	pool, err := pgxpool.Connect(context.Background(), dbUrl)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	return pool
}

// Brings the database to the most up-to-date version
func Migrate(migrationsDir string) {
	stdlib.RegisterDriverConfig(&stdlib.DriverConfig{})

	dbUrl := utils.GetEnv("DATABASE_URL", "postgresql://postgres@localhost:5432/postgres")
	db, err := sql.Open("pgx", dbUrl)
	if err != nil {
		log.Fatalf("failed to migrate: failed to connect to database: %v", err)
	}

	err = goose.Up(db, migrationsDir)
	if err != nil {
		log.Fatalf("failed to migrate: %v", err)
	}
}

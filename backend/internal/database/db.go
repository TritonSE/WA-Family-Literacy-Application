package database

import (
	"database/sql"
	"fmt"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/stdlib"
	"github.com/pressly/goose"
	"log"
	"os"
	"strconv"
)

func GetConnection() *pgx.Conn {
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort, _ := strconv.ParseUint(getEnv("DB_PORT", "5432"), 10, 16)
	dbUser := getEnv("DB_USER", "postgres")
	dbPass := getEnv("DB_PASS", "")
	dbDatabase := getEnv("DB_DATABASE", "postgres")

	conn, err := pgx.Connect(pgx.ConnConfig{
		Host:     dbHost,
		Port:     uint16(dbPort),
		User:     dbUser,
		Password: dbPass,
		Database: dbDatabase,
	})
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	return conn
}

// Brings the database to the most up-to-date version
func Migrate(migrationsDir string) {
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort, _ := strconv.ParseUint(getEnv("DB_PORT", "5432"), 10, 16)
	dbUser := getEnv("DB_USER", "postgres")
	dbPass := getEnv("DB_PASS", "")
	dbDatabase := getEnv("DB_DATABASE", "postgres")

	stdlib.RegisterDriverConfig(&stdlib.DriverConfig{})

	connString := fmt.Sprintf("host=%s port=%d user=%s password=%s database=%s", dbHost, dbPort, dbUser, dbPass, dbDatabase)
	db, err := sql.Open("pgx", connString)
	if err != nil {
		log.Fatalf("failed to migrate: failed to connect to database: %v", err)
	}

	err = goose.Up(db, migrationsDir)
	if err != nil {
		log.Fatalf("failed to migrate: %v", err)
	}
}

func getEnv(key string, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}

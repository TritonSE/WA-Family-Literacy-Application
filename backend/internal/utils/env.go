package utils

import "os"

// Wrapper around os.Getenv to get an environment variable, or use a default value
func GetEnv(key string, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}

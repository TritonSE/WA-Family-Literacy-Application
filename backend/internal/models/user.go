package models

/*
 * User Model
 * Each User represents a family account
 * ID is UID of Firebase Auth account
 */

type User struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	InSanDiego bool   `json:"in_san_diego"`
}

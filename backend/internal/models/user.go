package models

// Represents a user of the app, i.e. a family using the mobile app
type User struct {
	ID         string `json:"id"` // the ID of the corresponding Firebase Auth user, not a UUID
	Name       string `json:"name"`
	Email      string `json:"email"`
	InSanDiego bool   `json:"in_san_diego"`
}

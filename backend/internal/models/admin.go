package models

// Struct to represent an admin
type Admin struct {
	ID                 string `json:"id"` // the ID of the corresponding Firebase Auth user, not a UUID
	Name               string `json:"name"`
	Email              string `json:"email"`
	CanManageUsers     bool   `json:"can_manage_users"`
	CanUploadBooks     bool   `json:"can_upload_books"`
	CanEditBooks       bool   `json:"can_edit_books"`
	CanDeleteBooks     bool   `json:"can_delete_books"`
	CanAccessAnalytics bool   `json:"can_access_analytics"`
	CanChat 		   bool   `json:"can_chat"`
	IsPrimaryAdmin     bool   `json:"is_primary_admin"`
}

// Struct to read in fields used during admin creation
type CreateAdmin struct {
	Name               string `json:"name"`
	Email              string `json:"email"`
	Password           string `json:"password"`
	CanManageUsers     bool   `json:"can_manage_users"`
	CanUploadBooks     bool   `json:"can_upload_books"`
	CanEditBooks       bool   `json:"can_edit_books"`
	CanDeleteBooks     bool   `json:"can_delete_books"`
	CanAccessAnalytics bool   `json:"can_access_analytics"`
	CanChat 		   bool   `json:"can_chat"`
}

// Struct to read in fields used when updating an admin
type UpdateAdmin struct {
	Name               *string `json:"name"`
	CanManageUsers     *bool   `json:"can_manage_users"`
	CanUploadBooks     *bool   `json:"can_upload_books"`
	CanEditBooks       *bool   `json:"can_edit_books"`
	CanDeleteBooks     *bool   `json:"can_delete_books"`
	CanAccessAnalytics *bool   `json:"can_access_analytics"`
	CanChat 		   *bool   `json:"can_chat"`
}

// Struct used to track admin permissions
type Permissions struct {
	CanManageUsers     bool
	CanUploadBooks     bool
	CanEditBooks       bool
	CanDeleteBooks     bool
	CanAccessAnalytics bool
	CanChat bool
}

type Permission int

const (
	CanManageUsers = iota
	CanUploadBooks
	CanEditBooks
	CanDeleteBooks
	CanAccessAnalytics
	CanChat
)

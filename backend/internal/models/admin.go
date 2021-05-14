package models

type Admin struct {
	ID             string `json:"id"` // the ID of the corresponding Firebase Auth user, not a UUID
	Name           string `json:"name"`
	Email          string `json:"email"`
	CanManageUsers bool   `json:"can_manage_users"`
	CanUploadBooks bool   `json:"can_upload_books"`
	CanDeleteBooks bool   `json:"can_delete_books"`
	IsPrimaryAdmin bool   `json:"is_primary_admin"`
}

type CreateAdmin struct {
	Name           string `json:"name"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	CanManageUsers bool   `json:"can_manage_users"`
	CanUploadBooks bool   `json:"can_upload_books"`
	CanDeleteBooks bool   `json:"can_delete_books"`
	IsPrimaryAdmin bool   `json:"is_primary_admin"`
}

type UpdateAdmin struct {
	Name           *string `json:"name"`
	CanManageUsers *bool   `json:"can_manage_users"`
	CanUploadBooks *bool   `json:"can_upload_books"`
	CanDeleteBooks *bool   `json:"can_delete_books"`
}

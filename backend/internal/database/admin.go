package database

import (
	"context"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pkg/errors"

	"github.com/TritonSE/words-alive/internal/models"
)

type AdminDatabase struct {
	Conn *pgxpool.Pool
}

// Returns a struct containing admin permissions
func (db *AdminDatabase) FetchAdminPermissions(ctx context.Context, id string) (models.Permissions, error) {
	// Initialize struct for storing permissions
	var perms models.Permissions
	perms.CanManageUsers = false
	perms.CanUploadBooks = false
	perms.CanEditBooks = false
	perms.CanDeleteBooks = false
	perms.CanAccessAnalytics = false
	perms.CanChat = false

	// Query for permissions
	var query string = "SELECT can_manage_users, can_upload_books, can_edit_books, " +
		"can_delete_books, can_access_analytics, can_chat FROM admins WHERE id = $1"

	rows, err := db.Conn.Query(ctx, query, id)
	if err != nil {
		return perms, errors.Wrap(err, "error querying in FetchAdminPermissions")
	}
	defer rows.Close()

	// Admin ID not found
	if !rows.Next() {
		return perms, nil
	}

	// Scan and return permissions stored in db
	err = rows.Scan(&perms.CanManageUsers, &perms.CanUploadBooks, &perms.CanEditBooks,
		&perms.CanDeleteBooks, &perms.CanAccessAnalytics, &perms.CanChat)
	if err != nil {
		return perms, errors.Wrap(err, "error scanning in FetchAdminPermissions")
	}

	return perms, nil
}

// Create a new admin account
func (db *AdminDatabase) CreateAdmin(ctx context.Context, admin models.Admin) error {

	// Insert admin into database
	var query string = "INSERT INTO admins (id, name, email, " +
		"can_manage_users, can_upload_books, can_edit_books, can_delete_books, " +
		"can_access_analytics, can_chat, is_primary_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false)"

	_, err := db.Conn.Exec(ctx, query, admin.ID, admin.Name, admin.Email,
		admin.CanManageUsers, admin.CanUploadBooks, admin.CanEditBooks,
		admin.CanDeleteBooks, admin.CanAccessAnalytics, admin.CanChat)
	if err != nil {
		return errors.Wrap(err, "error in CreateAdmin")
	}

	return nil
}

// Get list of all admins
func (db *AdminDatabase) FetchAdmins(ctx context.Context) ([]models.Admin, error) {
	admins := make([]models.Admin, 0)

	// Query for all admins
	var query string = "SELECT id, name, email, can_manage_users, " +
		"can_upload_books, can_edit_books, can_delete_books, can_access_analytics, can_chat," +
		"is_primary_admin FROM " +
		"admins ORDER BY name"

	rows, err := db.Conn.Query(ctx, query)
	if err != nil {
		return nil, errors.Wrap(err, "error on SELECT FROM admin in FetchAdmins")
	}
	defer rows.Close()

	// Parse results of query into list of admins
	for rows.Next() {
		var admin models.Admin
		if err := rows.Scan(&admin.ID, &admin.Name, &admin.Email,
			&admin.CanManageUsers, &admin.CanUploadBooks, &admin.CanEditBooks,
			&admin.CanDeleteBooks, &admin.CanAccessAnalytics, &admin.CanChat, &admin.IsPrimaryAdmin); err != nil {
			return nil, errors.Wrap(err, "error scanning result of"+
				" SELECT FROM admin in FetchAdmins")
		}

		admins = append(admins, admin)
	}

	return admins, nil
}

// Get account info of a admin
func (db *AdminDatabase) FetchAdminByID(ctx context.Context, id string) (*models.Admin, error) {
	var admin models.Admin

	// Query for admin account
	var query string = "SELECT id, name, email, can_manage_users, can_upload_books, " +
		"can_edit_books, can_delete_books, can_access_analytics, can_chat, is_primary_admin " +
		"FROM admins WHERE " +
		"id = $1"
	rows, err := db.Conn.Query(ctx, query, id)
	if err != nil {
		return nil, errors.Wrap(err, "error querying in FetchAdminByID")
	}
	defer rows.Close()

	// No admin matching ID found
	if !rows.Next() {
		return nil, nil
	}

	// Scan information into admin struct and return
	err = rows.Scan(&admin.ID, &admin.Name, &admin.Email, &admin.CanManageUsers,
		&admin.CanUploadBooks, &admin.CanEditBooks, &admin.CanDeleteBooks,
		&admin.CanAccessAnalytics, &admin.CanChat, &admin.IsPrimaryAdmin)
	if err != nil {
		return nil, errors.Wrap(err, "error scanning in FetchUserByID")
	}
	return &admin, nil
}

// Get account info of an admin
func (db *AdminDatabase) FetchAdminByEmail(ctx context.Context, email string) (*models.Admin, error) {
	var admin models.Admin

	// Query for admin account
	var query string = "SELECT id, name, email, can_manage_users, can_upload_books, " +
		"can_edit_books, can_delete_books, can_access_analytics, can_chat, is_primary_admin FROM admins WHERE " +
		"email = $1"
	rows, err := db.Conn.Query(ctx, query, email)
	if err != nil {
		return nil, errors.Wrap(err, "error querying in FetchAdminByID")
	}
	defer rows.Close()

	// No admin matching ID found
	if !rows.Next() {
		return nil, nil
	}

	// Scan information into admin struct and return
	err = rows.Scan(&admin.ID, &admin.Name, &admin.Email, &admin.CanManageUsers,
		&admin.CanUploadBooks, &admin.CanEditBooks, &admin.CanDeleteBooks, &admin.CanAccessAnalytics,
		&admin.CanChat, &admin.IsPrimaryAdmin)
	if err != nil {
		return nil, errors.Wrap(err, "error scanning in FetchUserByID")
	}
	return &admin, nil
}

// Update admin information
func (db *AdminDatabase) UpdateAdmin(ctx context.Context, id string, admin models.UpdateAdmin) error {

	var query string = "UPDATE admins SET " +
		"name = COALESCE($1, name), " +
		"can_manage_users = COALESCE($2, can_manage_users), " +
		"can_upload_books = COALESCE($3, can_upload_books), " +
		"can_edit_books = COALESCE($4, can_edit_books), " +
		"can_delete_books = COALESCE($5, can_delete_books), " +
		"can_access_analytics = COALESCE($6, can_access_analytics), " +
		"can_chat = COALESCE($7, can_chat) " +
		"WHERE id = $8"

	cmd, err := db.Conn.Exec(ctx, query, admin.Name, admin.CanManageUsers,
		admin.CanUploadBooks, admin.CanEditBooks, admin.CanDeleteBooks,
		admin.CanAccessAnalytics, admin.CanChat, id)
	if err != nil {
		return errors.Wrap(err, "error on UPDATE admin")
	}

	if cmd.RowsAffected() != 1 {
		return errors.New("No admin to update")
	}

	return nil
}

// Deletes the admin with the given ID
func (db *AdminDatabase) RemoveAdmin(ctx context.Context, id string) error {
	_, err := db.Conn.Query(ctx, "DELETE FROM admins WHERE id = $1", id)
	if err != nil {
		return errors.Wrap(err, "error in RemoveAdmin")
	}

	return nil
}

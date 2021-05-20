export type Admin = {
  id: string
  name: string
  email: string
  can_manage_users: boolean
  can_upload_books: boolean
  can_delete_books: boolean
  can_edit_books: boolean
  is_primary_admin: boolean
};

export type CreateAdmin = {
  name: string
  email: string
  password: string
  can_manage_users: boolean
  can_upload_books: boolean
  can_delete_books: boolean
  can_edit_books: boolean
};

export type UpdateAdmin = {
  name: string
  can_manage_users: boolean
  can_upload_books: boolean
  can_delete_books: boolean
  can_edit_books: boolean
};
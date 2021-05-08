export type Admin = {
  id: string
  name: string
  email: string
  can_manage_users: boolean
  can_upload_books: boolean
  can_delete_books: boolean
  is_primary_admin: boolean
};
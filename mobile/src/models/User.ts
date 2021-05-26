export type User = {
  id: string;
  name: string;
  email: string;
  in_san_diego: boolean;
};

export type UpdateUser = {
  name?: string;
  in_san_diego?: boolean;
};

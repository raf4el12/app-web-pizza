export  interface CreateUserData {
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
}

export  interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
}
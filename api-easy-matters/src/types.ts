export type User = {
  id: number;
  email: string;
  firmName: string;
};

export type CreateUserData = {
  email: string;
  firmName: string;
  password: string;
};

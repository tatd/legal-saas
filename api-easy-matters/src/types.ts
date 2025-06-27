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

export type CreateCustomerData = {
  name: string;
  phoneNumber: string;
};

export type Customer = {
  id: number;
  name: string;
  phoneNumber: string;
  isActive: boolean;
};

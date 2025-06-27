import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';
import { CreateUserData } from 'types';

export type User = {
  id: number;
  email: string;
  firmName: string;
};

// export type UserDb = {
//   id: number;
//   email: string;
//   firm_name: string;
//   password_hash: string;
//   created_at: Date;
//   updated_at: Date;
// };

// Insert user into the db
export async function createUser(
  db: Knex,
  createUserInput: CreateUserData
): Promise<User> {
  const { email, firmName, password } = createUserInput;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [user] = await db('users')
    .insert({
      email,
      firm_name: firmName,
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning(['id', 'email', 'firm_name', 'created_at', 'updated_at']);

  return {
    id: user.id,
    email: user.email,
    firmName: user.firm_name
  };
}

// Get hashed password for matching email and firm name
// Verify password and hashed password
// Return JWT token
export async function login(
  db: Knex,
  email: string,
  firmName: string,
  password: string
): Promise<{ token: string; user: Omit<User, 'password'> }> {
  // Find user by email and firm name
  const user = await db('users')
    .where({
      email,
      firm_name: firmName
    })
    .first();

  if (!user) {
    throw new Error('Invalid email or firm name');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Generate JWT token
  const jwt = require('jsonwebtoken');
  const secret = process.env.JWT_SECRET || 'secret-key';
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      firmName: user.firm_name
    },
    secret,
    { expiresIn: '24h' }
  );

  // 4. Return token and user info (without password)
  // const { password_hash, ...userWithoutPassword } = user;
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firmName: user.firm_name
    }
  };
}

export async function findUserByEmail(
  db: Knex,
  email: string
): Promise<User | undefined> {
  return db('users').where({ email }).select('*').first();
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

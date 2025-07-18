import * as bcrypt from 'bcrypt';
import { CreateUserData } from 'types';
import db from '../db';

export type User = {
  id: number;
  email: string;
  firmName: string;
};

// Insert user into the db
export async function createUser(
  createUserData: CreateUserData
): Promise<User> {
  const { email, firmName, password } = createUserData;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [user] = await db
    .knex()('users')
    .insert({
      email,
      firm_name: firmName,
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning(['id', 'email', 'firm_name']);

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
  email: string,
  password: string
): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
  // Find user by email and firm name
  const user = await db.knex()('users').where({ email }).first();

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

  // Return token and user info
  return {
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      firmName: user.firm_name
    }
  };
}

// Validates token and returns user data
export function validateToken(token: string): User {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // Handle 'Bearer ' prefix if present
    const tokenValue = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token;
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'secret-key';

    // Verify and decode the token
    const decoded = jwt.verify(tokenValue, secret) as {
      userId: number;
      email: string;
      firmName: string;
      iat: number;
      exp: number;
    };

    // Return the user data
    return {
      id: decoded.userId,
      email: decoded.email,
      firmName: decoded.firmName
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
    }
    throw new Error('Failed to authenticate token');
  }
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  return db.knex()('users').where({ email }).select('*').first();
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

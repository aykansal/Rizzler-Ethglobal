const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: { id: string; nfcId: string; phoneNumber: string }): string => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const validateRequired = (obj: any, requiredFields: string[]): string | null => {
  for (const field of requiredFields) {
    if (!obj[field]) {
      return `${field} is required`;
    }
  }
  return null;
};

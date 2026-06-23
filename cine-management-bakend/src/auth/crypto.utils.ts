import * as crypto from 'crypto';

export const hashPassword = (password: string): string => {
  // Encriptamos la contraseña en formato SHA-256
  return crypto.createHash('sha256').update(password).digest('hex');
};

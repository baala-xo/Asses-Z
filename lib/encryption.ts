// lib/encryption.ts

import * as CryptoJS from 'crypto-js';

const secretKey = process.env.ENCRYPTION_SECRET_KEY;

if (!secretKey) {
  throw new Error('ENCRYPTION_SECRET_KEY is not set in the environment variables');
}

// Function to encrypt data
export function encrypt(text: string): string {
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
}

// Function to decrypt data
export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
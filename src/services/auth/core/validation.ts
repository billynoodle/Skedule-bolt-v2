import { createErrors } from './errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): void {
  if (!email?.trim()) {
    throw createErrors.invalidEmail();
  }

  if (!EMAIL_REGEX.test(email)) {
    throw createErrors.invalidEmail();
  }
}

export function validatePassword(password: string): void {
  if (!password) {
    throw createErrors.invalidPassword();
  }

  if (password.length < 6) {
    throw createErrors.invalidPassword();
  }
}

export function validatePasswordConfirmation(password: string, confirmation: string): void {
  if (password !== confirmation) {
    throw createErrors.passwordsDontMatch();
  }
}

// Centralized validation
export const validateAuth = {
  signIn: (email: string, password: string) => {
    validateEmail(email);
    validatePassword(password);
  },
  signUp: (email: string, password: string, confirmation: string) => {
    validateEmail(email);
    validatePassword(password);
    validatePasswordConfirmation(password, confirmation);
  },
  passwordReset: (email: string) => {
    validateEmail(email);
  },
  passwordUpdate: (password: string, confirmation: string) => {
    validatePassword(password);
    validatePasswordConfirmation(password, confirmation);
  }
};
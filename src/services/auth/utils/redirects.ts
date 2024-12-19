export function getAuthRedirectUrl(path: string): string {
  return `${window.location.origin}/auth/${path}`;
}

export function getCallbackUrl(): string {
  return getAuthRedirectUrl('callback');
}

export function getPasswordResetUrl(): string {
  return getAuthRedirectUrl('update-password');
}
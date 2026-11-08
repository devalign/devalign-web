/**
 * Password validation rules and security verification helpers.
 */

export interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  { label: 'Mínimo 8 caracteres', test: (pw: string) => pw.length >= 8 },
  { label: 'Una letra mayúscula', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Una letra minúscula', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'Un número o carácter especial', test: (pw: string) => /[\d\W]/.test(pw) },
];

export function isPasswordSecure(password: string): boolean {
  return passwordRequirements.every((req) => req.test(password));
}

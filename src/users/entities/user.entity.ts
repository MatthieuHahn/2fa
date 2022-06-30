export interface User {
  userId: number;
  email: string;
  username: string;
  password: string;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
}

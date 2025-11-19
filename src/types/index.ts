export enum UserRole {
  User = 'user',
  Agent = 'agent',
  Admin = 'admin',
  SuperAgent = 'superagent',
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  photo_url: string;
  token: string;
  rakeback: number;
  agency: number;
  balance: number;
  unclaimed_balance: number;
  role: UserRole;
  wallet: object;
}

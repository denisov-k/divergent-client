export enum UserRole {
  User = 'user',
  Agent = 'agent',
  Admin = 'admin',
  SuperAgent = 'superagent',
}

export interface User {
  id: number;
  level: number;
  name: string | null;
  email: string;
  photo_url: string;
  token: string;
  role: UserRole;
}

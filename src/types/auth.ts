export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  seats_available: number;
  created_at: string;
}

export interface Reservation {
  id: number;
  user_id: number;
  event_id: number;
  tickets: number;
  created_at: string;
  event: Event;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
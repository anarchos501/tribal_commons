export interface Tribe {
  id: number;
  name: string;
  description?: string;
  locality: string;
  role?: string;
  createdAt?: string;
  deletedAt?: string | null;
}

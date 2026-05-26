import type { CharacterProfile } from "./characterProfile";

export interface UserAccount {
  id: number;
  username: string;
  email?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  characters?: CharacterProfile[];
}

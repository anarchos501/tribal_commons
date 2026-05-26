export interface Membership {
  id: number;
  tribeId: number;
  characterProfileId?: number | null;
  role: string;
  createdAt: string;
}

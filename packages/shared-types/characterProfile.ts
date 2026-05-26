export interface CharacterProfile {
  id: number;
  userAccountId: number;
  characterName: string;
  frontierWalletAddress?: string | null;
  frontierCharacterId?: string | null;
  verified: boolean;
  createdAt: string;
  deletedAt?: string | null;
}

export interface Petition {
  id: number;
  type: "project" | "federation";
  title: string;
  description: string;
  status: "open" | "accepted" | "rejected" | "archived";
  proposerName: string;
  proposerCharacterId?: number | null;
  tribeId: number;
  projectId?: number | null;
  targetTribeId?: number | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt?: string;
  sponsors?: PetitionSponsor[];
  supports?: PetitionSupport[];
}

export interface PetitionSponsor {
  id: number;
  petitionId: number;
  sponsorName: string;
  sponsorCharacterId?: number | null;
  createdAt: string;
}

export interface PetitionSupport {
  id: number;
  petitionId: number;
  supporterName: string;
  supporterCharacterId?: number | null;
  createdAt: string;
}

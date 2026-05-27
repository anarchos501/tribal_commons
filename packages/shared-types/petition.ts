import type { ThresholdReadiness } from "./governance";

export interface Petition {
  id: number;
  type: "project" | "federation";
  title: string;
  description: string;
  status:
    | "draft"
    | "open"
    | "accepted"
    | "rejected"
    | "archived";
  proposerName: string;
  proposerCharacterId?: number | null;
  tribeId: number;
  projectId?: number | null;
  targetTribeId?: number | null;
  metadata?: Record<string, unknown> | null;
  publishAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  sponsors?: PetitionSponsor[];
  supports?: PetitionSupport[];
  sponsorRequests?: PetitionSponsorRequest[];
  readiness?: ThresholdReadiness | null;
}

export interface PetitionSponsor {
  id: number;
  petitionId: number;
  sponsorName: string;
  sponsorCharacterId?: number | null;
  createdAt: string;
  removedAt?: string | null;
}

export interface PetitionSupport {
  id: number;
  petitionId: number;
  supporterName: string;
  supporterCharacterId?: number | null;
  createdAt: string;
}

export interface PetitionSponsorRequest {
  id: number;
  petitionId: number;
  requestType: "invite" | "request";
  status:
    | "pending"
    | "accepted"
    | "declined"
    | "canceled"
    | "expired";
  requesterName: string;
  requesterCharacterId?: number | null;
  recipientName?: string | null;
  recipientCharacterId?: number | null;
  createdAt: string;
  updatedAt?: string;
  readiness?: {
    approval: ThresholdReadiness;
    decline: ThresholdReadiness;
  };
}

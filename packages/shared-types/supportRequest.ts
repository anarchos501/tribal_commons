export interface SupportRequest {
  id: number;
  tribeId?: number | null;
  projectId?: number | null;
  requesterCharacterId?: number | null;
  requesterName: string;
  title: string;
  description: string;
  resourceType: string;
  amountRequested: number;
  supportType: "peer" | "commons" | "both";
  status: "open" | "fulfilled" | "closed";
  createdAt: string;
}

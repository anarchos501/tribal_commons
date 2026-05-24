export interface AidRequest {
  id: number;
  tribeId: number;
  requesterName: string;
  title: string;
  description: string;
  resourceType: string;
  amountRequested: number;
  supportType: "peer" | "commons" | "both";
  status: "open" | "fulfilled" | "closed";
  createdAt: string;
}
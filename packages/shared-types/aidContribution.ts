export interface AidContribution {
  id: number;
  aidRequestId: number;
  contributorName: string;
  sourceType: "peer" | "commons";
  resourceType: string;
  amount: number;
  createdAt: string;
}
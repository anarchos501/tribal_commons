export interface Contribution {
  id: number;

  projectId?: number;
  supportRequestId?: number;

  contributorName: string;
  sourceType?: "peer" | "commons";

  resourceType: string;
  amount: number;

  createdAt: string;
}
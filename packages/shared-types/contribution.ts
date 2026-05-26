export interface Contribution {
  id: number;

  projectId?: number | null;
  supportRequestId?: number | null;
  commonsPoolId?: number | null;
  contributorCharacterId?: number | null;

  contributorName: string;

  resourceType: string;
  amount: number;

  createdAt: string;
}

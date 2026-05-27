import type { ThresholdReadiness } from "./governance";

export interface SupportRequest {
  id: number;
  tribeId?: number | null;
  projectId?: number | null;
  commonsPoolId?: number | null;
  requesterCharacterId?: number | null;
  requesterName: string;
  title: string;
  description: string;
  resourceType: string;
  amountRequested: number;
  supportType: "peer" | "commons" | "both";
  requestedFromType:
    | "individuals"
    | "tribal_commons_pool"
    | "project_resource_pool";
  status:
    | "open"
    | "pending_approval"
    | "approved"
    | "partially_fulfilled"
    | "fulfilled"
    | "archived"
    | "rejected"
    | "closed";
  createdAt: string;
  supports?: SupportRequestSupport[];
  contributions?: Array<{
    id: number;
    amount: number;
    resourceType: string;
    contributorName: string;
  }>;
  approvalRequired?: boolean;
  readiness?: ThresholdReadiness | null;
  fulfillment?: {
    amountRequested: number;
    contributedAmount: number;
    remainingAmount: number;
  };
}

export interface SupportRequestSupport {
  id: number;
  supportRequestId: number;
  supporterName: string;
  supporterCharacterId?: number | null;
  value: 1 | -1;
  createdAt: string;
  updatedAt?: string;
}

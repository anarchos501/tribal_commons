export interface Project {
  id: number;
  tribeId: number;
  title: string;
  status:
    | "proposal"
    | "staging"
    | "sustained"
    | "completed"
    | "failed"
    | "archived";
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  archivedAt?: string | null;
}

export interface ProjectMembership {
  id: number;
  projectId: number;
  characterProfileId?: number | null;
  memberName: string;
  role: string;
  createdAt: string;
  removedAt?: string | null;
}

export interface ProjectAction {
  id: number;
  projectId: number;
  title: string;
  description: string;
  actionType: string;
  status: "open" | "accepted" | "rejected" | "archived";
  proposerName: string;
  proposerCharacterId?: number | null;
  resourceType?: string | null;
  amount?: number | null;
  resourceNote?: string | null;
  createdAt: string;
  updatedAt?: string;
  acceptedAt?: string | null;
  archivedAt?: string | null;
  supports?: ProjectActionSupport[];
}

export interface ProjectActionSupport {
  id: number;
  actionId: number;
  supporterName: string;
  supporterCharacterId?: number | null;
  createdAt: string;
}

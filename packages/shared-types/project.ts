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

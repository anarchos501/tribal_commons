import type { ActivityType } from "./constants";

export interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  message: string;
  entityType?: string | null;
  entityId?: number | null;
  tribeId?: number | null;
  actorName?: string | null;
  actorCharacterId?: number | null;
  createdAt?: string;
}

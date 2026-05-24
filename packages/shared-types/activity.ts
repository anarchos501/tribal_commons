import type { ActivityType } from "./constants";

export interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  message: string;
}
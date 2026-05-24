import type { CoordinationType } from "./constants";

export interface CoordinationItem {
  id: number;

  type: CoordinationType;

  title: string;

  description: string;
}
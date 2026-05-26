export type GovernancePreferenceValue = -1 | 0 | 1;

export type GovernanceTemperatureLabel =
  | "Restrictive"
  | "Neutral"
  | "Open";

export type GovernanceThresholdBand =
  | "restrictive"
  | "neutral"
  | "open";

export interface GovernanceTopic {
  id: number;
  tribeId: number;
  projectId?: number | null;
  scope: "tribe" | "project";
  key: string;
  title: string;
  description: string;
  minLabel: string;
  maxLabel: string;
  createdAt: string;
}

export interface GovernanceTemperature {
  topicId: number;
  preferenceCount: number;
  averageValue: number;
  temperatureScore: number;
  temperatureLabel: GovernanceTemperatureLabel;
  thresholdBand: GovernanceThresholdBand;
  requiredSignaturePercentage: number;
}

export const coordinationTypes = [
  "project",
  "petition",
  "support",
  "commons"
] as const;

export type CoordinationType =
  typeof coordinationTypes[number];

export const activityTypes = [
  "support",
  "petition",
  "contribution",
  "commons",
  "project"
] as const;

export type ActivityType =
  typeof activityTypes[number];
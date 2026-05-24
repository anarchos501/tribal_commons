export const coordinationTypes = [
  "project",
  "petition",
  "aid",
  "commons"
] as const;

export type CoordinationType =
  typeof coordinationTypes[number];

export const activityTypes = [
  "aid",
  "petition",
  "donation",
  "commons",
  "project"
] as const;

export type ActivityType =
  typeof activityTypes[number];
export const defaultGovernanceTopics = [
  {
    key: "membership_approval_threshold",
    title: "Membership Approval Threshold",
    description:
      "How many existing tribe members should approve before a new character can join."
  },
  {
    key: "project_activation_threshold",
    title: "Project Activation Threshold",
    description:
      "How many signatures should be needed before a project moves from proposal to staging."
  },
  {
    key: "support_request_approval_threshold",
    title: "Support Request Approval Threshold",
    description:
      "How many signatures should be needed before a support request is considered actionable."
  },
  {
    key: "federation_decision_threshold",
    title: "Federation Decision Threshold",
    description:
      "How many tribe members should sign before the tribe approves federation actions."
  }
] as const;

export const defaultProjectGovernanceTopics = [
  {
    key: "project_action_approval_threshold",
    title: "Project Action Approval Threshold",
    description:
      "How much project member support is needed before an internal project action is accepted."
  }
] as const;

export type GovernanceTemperatureBand =
  | "restrictive"
  | "neutral"
  | "open";

export const getTemperatureScore = (
  averageValue: number
) => {
  const boundedAverage = Math.max(
    -1,
    Math.min(1, averageValue)
  );

  return Math.round(((boundedAverage + 1) / 2) * 100);
};

export const getThresholdBand = (
  score: number
): GovernanceTemperatureBand => {
  if (score <= 33) {
    return "restrictive";
  }

  if (score >= 67) {
    return "open";
  }

  return "neutral";
};

export const getTemperatureLabel = (
  score: number
) => {
  const band = getThresholdBand(score);

  if (band === "restrictive") {
    return "Restrictive";
  }

  if (band === "open") {
    return "Open";
  }

  return "Neutral";
};

export const getRequiredSignaturePercentage = (
  score: number
) => {
  const band = getThresholdBand(score);

  if (band === "restrictive") {
    return 70;
  }

  if (band === "open") {
    return 30;
  }

  return 50;
};

export type ThresholdReadinessInput = {
  eligibleParticipantCount: number;
  requiredSignaturePercentage: number;
  currentSupportCount: number;
};

export type ThresholdReadiness = {
  eligibleParticipantCount: number;
  requiredSignaturePercentage: number;
  requiredSignatureCount: number;
  currentSupportCount: number;
  readinessPercentage: number;
  thresholdMet: boolean;
};

export const calculateThresholdReadiness = ({
  eligibleParticipantCount,
  requiredSignaturePercentage,
  currentSupportCount
}: ThresholdReadinessInput): ThresholdReadiness => {
  const normalizedEligibleParticipantCount = Math.max(
    0,
    eligibleParticipantCount
  );

  const requiredSignatureCount = Math.max(
    1,
    Math.ceil(
      normalizedEligibleParticipantCount *
        (requiredSignaturePercentage / 100)
    )
  );

  const readinessPercentage =
    requiredSignatureCount === 0
      ? 100
      : Math.min(
          100,
          Math.round(
            (currentSupportCount / requiredSignatureCount) * 100
          )
        );

  return {
    eligibleParticipantCount:
      normalizedEligibleParticipantCount,
    requiredSignaturePercentage,
    requiredSignatureCount,
    currentSupportCount,
    readinessPercentage,
    thresholdMet:
      currentSupportCount >= requiredSignatureCount
  };
};

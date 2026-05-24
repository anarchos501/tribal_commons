import type {
  CoordinationItem
} from "../../../../packages/shared-types";

export const getCoordinationHubData =
(): CoordinationItem[] => {

  return [
    {
      id: 1,
      type: "project",
      title: "Orbital Refinery Expansion",
      description:
        "Infrastructure expansion project requiring logistics support."
    },

    {
      id: 2,
      type: "petition",
      title: "Regional Logistics Network",
      description:
        "Petition awaiting additional signatures."
    },

    {
      id: 3,
      type: "aid",
      title: "Recovery After Station Raid",
      description:
        "Aid coordination and recovery logistics ongoing."
    },

    {
      id: 4,
      type: "commons",
      title: "Frontier Emergency Reserve",
      description:
        "Commons allocation request under review."
    }
  ];
};
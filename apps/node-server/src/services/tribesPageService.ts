import type { Tribe } from "../../../../packages/shared-types";

export const getTribesPageData = (): Tribe[] => {
  return [
    {
      id: 1,
      name: "Outer Rim Cooperative",
      role: "Member",
      locality: "Outer Frontier"
    },

    {
      id: 2,
      name: "Frontier Logistics Network",
      role: "Observer",
      locality: "Trade Corridor"
    }
  ];
};
import type { Tribe } from "../../../../../packages/shared-types";

let tribes: Tribe[] = [
  {
    id: 1,
    name: "Outer Rim Cooperative",
    locality: "Outer Frontier",
    role: "Member"
  },

  {
    id: 2,
    name: "Frontier Logistics Network",
    locality: "Trade Corridor",
    role: "Observer"
  }
];

export const getTribesData = (): Tribe[] => {
  return tribes;
};

export const createTribeData = (
  name: string,
  locality: string
): Tribe => {

  const newTribe: Tribe = {
    id: tribes.length + 1,
    name,
    locality,
    role: "Member"
  };

  tribes.push(newTribe);

  return newTribe;
};
import type { Activity } from "../../../../packages/shared-types";

export const getActivityFeedData = (): Activity[] => {
  return [
    {
      id: 1,
      type: "aid",
      title: "Recovery After Station Raid",
      message:
        "Anarchos opened an aid request for Titanium support."
    },

    {
      id: 2,
      type: "petition",
      title: "Regional Logistics Network",
      message:
        "Petition requires additional signatures."
    },

    {
      id: 3,
      type: "donation",
      title: "Project Donation",
      message:
        "500 Titanium donated to Orbital Refinery Expansion."
    },

    {
      id: 4,
      type: "commons",
      title: "Commons Allocation Request",
      message:
        "2000 Titanium requested from Frontier Emergency Reserve."
    }
  ];
};
import { Request, Response } from "express";

export const getDashboard = (req: Request, res: Response) => {

  const playerName = req.params.playerName;

  res.json({
    player: playerName,

    memberships: [
      {
        tribeId: 1,
        tribeName: "Outer Rim Cooperative"
      }
    ],

    myProjects: [
      {
        id: 1,
        title: "Orbital Refinery Expansion",
        status: "active"
      }
    ],

    openAidRequests: [
      {
        id: 1,
        title: "Recovery After Station Raid",
        status: "open"
      }
    ],

    recentDonations: [
      {
        projectId: 1,
        resourceType: "Titanium",
        amount: 500
      }
    ],

    pendingPetitions: [
      {
        projectId: 2,
        title: "Regional Logistics Network"
      }
    ]
  });
};
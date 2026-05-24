import { Request, Response } from "express";

export const getTribesPage = (req: Request, res: Response) => {

  const tribes = [
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

  res.json(tribes);
};
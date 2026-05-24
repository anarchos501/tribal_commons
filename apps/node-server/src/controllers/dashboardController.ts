import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboardService";

export const getDashboard = (
  req: Request,
  res: Response
) => {
  const playerNameParam = req.params.playerName;

  const playerName = Array.isArray(playerNameParam)
    ? playerNameParam[0]
    : playerNameParam;

  const dashboardData =
    getDashboardData(playerName);

  res.json(dashboardData);
};
import { Request, Response } from "express";
import { getDashboardData } from "../services/dashboardService";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  const characterNameParam =
    req.params.characterName;

  const characterName = Array.isArray(
    characterNameParam
  )
    ? characterNameParam[0]
    : characterNameParam;

  const dashboardData =
    await getDashboardData(characterName);

  res.json(dashboardData);
};
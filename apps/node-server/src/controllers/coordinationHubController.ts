import { Request, Response } from "express";
import { getCoordinationHubData } from "../services/coordinationHubService";

export const getCoordinationHub = (
  req: Request,
  res: Response
) => {

  const coordinationItems =
    getCoordinationHubData();

  res.json(coordinationItems);
};
import { Request, Response } from "express";
import { getActivityFeedData } from "../services/activityFeedService";

export const getActivityFeed = (
  req: Request,
  res: Response
) => {

  const activities =
    getActivityFeedData();

  res.json(activities);
};
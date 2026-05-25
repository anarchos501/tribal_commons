import { Request, Response } from "express";
import { getActivityFeedData } from "../services/activityFeedService";

export const getActivityFeed = async (
  req: Request,
  res: Response
) => {
  const activities = await getActivityFeedData();

  res.json(activities);
};
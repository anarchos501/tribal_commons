import { Request, Response } from "express";
import { getActivityFeedData } from "../services/activityFeedService";

export const getActivityFeed = async (
  req: Request,
  res: Response
) => {
  const characterProfileId =
    typeof req.query.characterProfileId === "string"
      ? Number(req.query.characterProfileId)
      : undefined;

  const activities = await getActivityFeedData(
    characterProfileId
  );

  res.json(activities);
};

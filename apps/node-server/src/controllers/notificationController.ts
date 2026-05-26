import { Request, Response } from "express";
import type { Notification } from "../../../../packages/shared-types/notification";

let notifications: Notification[] = [];

export const getNotifications = (
  req: Request,
  res: Response
) => {
  const characterName =
    req.params.characterName;

  const characterNotifications =
    notifications.filter(
      notification =>
        notification.characterName ===
        characterName
    );

  res.json(characterNotifications);
};

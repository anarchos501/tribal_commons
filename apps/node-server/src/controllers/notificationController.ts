import { Request, Response } from "express";
import type { Notification } from "../../../../packages/shared-types/notification";

let notifications: Notification[] = [
  {
    id: 1,
    characterName: "Anarchos",
    type: "support_request",
    message:
      "A new support request was opened in Outer Rim Cooperative.",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    characterName: "Anarchos",
    type: "petition",
    message:
      "Regional Logistics Network requires additional signatures.",
    read: false,
    createdAt: new Date().toISOString()
  }
];

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
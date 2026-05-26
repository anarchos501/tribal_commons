import { Request, Response } from "express";
import type { Notification } from "../../../../packages/shared-types/notification";

let notifications: Notification[] = [
  {
    id: 1,
    playerName: "Anarchos",
    type: "support_request",
    message: "A new support request was opened in Outer Rim Cooperative.",
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    playerName: "Anarchos",
    type: "petition",
    message: "Regional Logistics Network requires additional signatures.",
    read: false,
    createdAt: new Date().toISOString()
  }
];

export const getNotifications = (req: Request, res: Response) => {

  const playerName = req.params.playerName;

  const playerNotifications = notifications.filter(
    notification => notification.playerName === playerName
  );

  res.json(playerNotifications);
};
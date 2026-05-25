import { Request, Response } from "express";

import {
  createUserAccountData,
  getUserAccountsData,
  getUserAccountData,
  createCharacterProfileData,
  deactivateUserAccountData
} from "../domains/accounts/accountService";

export const getUserAccounts = async (
  req: Request,
  res: Response
) => {
  const accounts = await getUserAccountsData();

  res.json(accounts);
};

export const getUserAccount = async (
  req: Request,
  res: Response
) => {
  const accountId = Number(req.params.accountId);

  const account = await getUserAccountData(accountId);

  if (!account) {
    return res.status(404).json({
      error: "User account not found"
    });
  }

  res.json(account);
};

export const createUserAccount = async (
  req: Request,
  res: Response
) => {
  try {
const { username, email } = req.body;

if (!username) {
  return res.status(400).json({
    error: "username is required"
  });
}

const account = await createUserAccountData(
  username,
  email
);

    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({
      error: "Unable to create user account"
    });
  }
};

export const createCharacterProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userAccountId,
      characterName,
      frontierWalletAddress,
      frontierCharacterId
    } = req.body;

    if (!userAccountId || !characterName) {
      return res.status(400).json({
        error: "userAccountId and characterName are required"
      });
    }

    const character = await createCharacterProfileData(
      userAccountId,
      characterName,
      frontierWalletAddress,
      frontierCharacterId
    );

    res.status(201).json(character);
  } catch (error) {
    res.status(400).json({
      error: "Unable to create character profile"
    });
  }
};

export const deactivateUserAccount = async (
  req: Request,
  res: Response
) => {
  try {
    const accountId = Number(req.params.accountId);

    const account =
      await deactivateUserAccountData(accountId);

    res.json(account);
  } catch (error) {
    res.status(400).json({
      error: "Unable to deactivate user account"
    });
  }
};
import { prisma } from "../../lib/prisma";

export const createUserAccountData = async (
  username: string,
  email?: string
) => {
  return prisma.userAccount.create({
    data: {
      username,
      email
    },
    include: {
      characters: true
    }
  });
};

export const getUserAccountsData = async () => {
  return prisma.userAccount.findMany({
    where: {
      deletedAt: null
    },
    include: {
      characters: {
        where: {
          deletedAt: null
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const getUserAccountData = async (
  accountId: number
) => {
  return prisma.userAccount.findFirst({
    where: {
      id: accountId,
      deletedAt: null
    },
    include: {
      characters: {
        where: {
          deletedAt: null
        }
      }
    }
  });
};

export const createCharacterProfileData = async (
  userAccountId: number,
  characterName: string,
  frontierWalletAddress?: string,
  frontierCharacterId?: string
) => {
  return prisma.characterProfile.create({
    data: {
      userAccountId,
      characterName,
      frontierWalletAddress,
      frontierCharacterId,
      verified: false
    },
    include: {
      userAccount: true
    }
  });
};

export const deactivateUserAccountData = async (
  accountId: number
) => {
  return prisma.userAccount.update({
    where: {
      id: accountId
    },
    data: {
      deletedAt: new Date(),
      characters: {
        updateMany: {
          where: {
            deletedAt: null
          },
          data: {
            deletedAt: new Date()
          }
        }
      }
    }
  });
};
import { prisma } from "../../lib/prisma";
import { seedDefaultGovernanceTopicsForTribe } from "../policies/policyService";

export const getTribesData = async () => {
  return prisma.tribe.findMany({
    where: {
      deletedAt: null
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createTribeData = async (
  name: string,
  locality: string
) => {
  const tribe = await prisma.tribe.create({
    data: {
      name,
      locality
    }
  });

  await seedDefaultGovernanceTopicsForTribe(tribe.id);

  return tribe;
};

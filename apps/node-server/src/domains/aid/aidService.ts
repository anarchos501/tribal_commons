import { prisma } from "../../lib/prisma";

export const getAidRequestsData = async () => {
  return prisma.aidRequest.findMany({
    include: {
      tribe: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const createAidRequestData = async (
  tribeId: number,
  requesterName: string,
  title: string,
  description: string,
  resourceType: string,
  amountRequested: number,
  supportType: string
) => {
  return prisma.aidRequest.create({
    data: {
      tribeId,
      requesterName,
      title,
      description,
      resourceType,
      amountRequested,
      supportType,
      status: "open"
    },
    include: {
      tribe: true
    }
  });
};
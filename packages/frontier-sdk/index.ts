export type FrontierExternalSource =
  | "frontier"
  | "manual"
  | "unknown";

export interface ResourceReference {
  resourceType: string;
  externalSource?: FrontierExternalSource;
  externalId?: string;
}

export interface FrontierCharacterIdentity {
  characterName: string;
  walletAddress?: string;
  verified: boolean;
}

export interface FrontierAssemblyReference {
  assemblyId: string;
  name?: string;
  locality?: string;
}

export const verifyCharacterIdentity = async (
  characterName: string
): Promise<FrontierCharacterIdentity> => {
  return {
    characterName,
    verified: false
  };
};

export const getAssemblyInventory = async (
  assemblyId: string
): Promise<ResourceReference[]> => {
  console.log(
    "Frontier inventory lookup not implemented yet:",
    assemblyId
  );

  return [];
};

export const verifyAssemblyOwnership = async (
  assemblyId: string,
  characterName: string
): Promise<boolean> => {
  console.log(
    "Frontier ownership verification not implemented yet:",
    assemblyId,
    characterName
  );

  return false;
};
export interface Petition {
  id: number;
  projectId: number;
  signer: string;
  signerCharacterId?: number | null;
  createdAt: string;
}

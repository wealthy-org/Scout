import type { DossierStatus, DossierItemKind } from "@/lib/db/schema";

export interface DossierItemData {
  id: string;
  dossierId: string;
  kind: DossierItemKind;
  text: string;
  position: number;
}

export interface DossierQuestionData {
  id: string;
  dossierId: string;
  text: string;
  done: boolean;
  position: number;
}

export interface DossierLogData {
  id: string;
  dossierId: string;
  at: string | Date;
  text: string;
}

export interface DossierSnapshotData {
  id: string;
  dossierId: string;
  at: string | Date;
  chainJson?: unknown;
  marketJson?: unknown;
  reposJson?: unknown;
  launchesJson?: unknown;
  launchTotal?: number | null;
  curveJson?: unknown;
}

export interface DossierData {
  id: string;
  walletAddress: string;
  chainId: number;
  contractAddress: string;
  symbol: string | null;
  name: string | null;
  status: DossierStatus | null;
  reason: string | null;
  thesis: string | null;
  notes: string | null;
  decisionReason: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  originAuthor: string | null;
  originAt: string | Date | null;
  items: DossierItemData[];
  questions: DossierQuestionData[];
  logs: DossierLogData[];
  snapshots: DossierSnapshotData[];
}

export interface GetDossierResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
  dossier?: DossierData;
  chain?: Record<string, unknown> | null;
  market?: Record<string, unknown> | null;
  research?: Record<string, unknown> | null;
}

export interface PutDossierItemInput {
  kind: DossierItemKind;
  text: string;
  position?: number;
}

export interface PutDossierQuestionInput {
  text: string;
  done?: boolean;
  position?: number;
}

export interface PutDossierRequestBody {
  status?: DossierStatus | null;
  reason?: string | null;
  thesis?: string | null;
  decision_reason?: string | null;
  notes?: string | null;
  items?: PutDossierItemInput[];
  questions?: PutDossierQuestionInput[];
}

export interface PutDossierResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
}

export interface DeleteDossierResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
}

export interface ConnectedDossierSummary {
  id: string;
  contractAddress: string;
  symbol: string | null;
  name: string | null;
  status: DossierStatus | null;
  reason: string | null;
  decisionReason: string | null;
  thesis: string | null;
  firstQuestion: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface GetDeployerDossiersResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
  dossiers?: ConnectedDossierSummary[];
}

export interface LibraryDossierSummary {
  id: string;
  walletAddress: string;
  chainId: number;
  contractAddress: string;
  symbol: string | null;
  name: string | null;
  status: DossierStatus | null;
  reason: string | null;
  thesis: string | null;
  decisionReason: string | null;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  originAuthor: string | null;
  originAt: string | Date | null;
}

export interface GetLibraryResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
  dossiers?: LibraryDossierSummary[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface ImportDossierItemInput {
  contractAddress?: string;
  contract_address?: string;
  chainId?: number;
  chain_id?: number;
  symbol?: string | null;
  name?: string | null;
  status?: DossierStatus | null;
  reason?: string | null;
  thesis?: string | null;
  decisionReason?: string | null;
  decision_reason?: string | null;
  notes?: string | null;
  items?: PutDossierItemInput[];
  questions?: PutDossierQuestionInput[];
}

export interface ImportLibraryResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
  imported?: number;
  skipped?: number;
  errors?: string[];
}


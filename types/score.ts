export type DeployerLabel = "fresh" | "repeat" | "serial";
export type DeployerBand = "green" | "yellow" | "red";

export interface DeployerScoreSignals {
  grad_rate: number;
  doa_rate: number;
  burst_rate: number;
  total_launches: number;
  graduated_count: number;
}

export interface DeployerScoreResult {
  score: number;
  label: DeployerLabel;
  band: DeployerBand;
  signals: DeployerScoreSignals;
  isContract?: boolean;
}

export interface DeployerLaunchInput {
  token: string;
  graduated?: boolean;
  isDoa?: boolean;
  isBurst?: boolean;
  launchedAt?: Date | string | number;
}

export interface DeployerProfileData {
  deployerAddress: string;
  totalLaunches: number;
  graduatedCount: number;
  deadOnArrivalCount: number;
  burstLaunches: number;
  feeRecipientReuse: number;
  score: number;
  label: DeployerLabel;
  band: DeployerBand;
  updatedAt: string | Date;
}

export interface DeployerLaunchRecord {
  deployerAddress?: string;
  tokenAddress: string;
  block?: number | null;
  phase?: string | null;
}

export interface GetDeployerResponseBody {
  ok?: boolean;
  error?: string;
  details?: unknown;
  deployer?: DeployerProfileData;
  signals?: DeployerScoreSignals;
  launches?: DeployerLaunchRecord[];
}

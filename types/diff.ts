export type DiffFieldKey =
  | "fdv"
  | "liquidity"
  | "deployer_score"
  | "market_appeared"
  | "curve_graduated"
  | "fee_recipient_changed"
  | "new_repo_commit"
  | "new_deployer_launch";

export type DiffBooleanTrigger =
  | "market_appeared"
  | "curve_graduated"
  | "fee_recipient_changed"
  | "new_repo_commit"
  | "new_deployer_launch";

export interface DiffThresholdConfig {
  fdv_pct: number;
  liquidity_pct: number;
  score_points: number;
}

export interface DiffItem {
  field: DiffFieldKey;
  label: string;
  oldVal: string | number | boolean | null;
  newVal: string | number | boolean | null;
  delta?: number;
  pctDelta?: number;
  exceeded: boolean;
  isBooleanTrigger: boolean;
}

export interface SnapshotData {
  fdv?: number | null;
  liquidity?: number | null;
  deployer_score?: number | null;
  market_appeared?: boolean | null;
  curve_graduated?: boolean | null;
  fee_recipient_changed?: boolean | null;
  new_repo_commit?: boolean | null;
  new_deployer_launch?: boolean | null;
  hasPool?: boolean | null;
  phase?: string | null;
  feeRecipient?: string | null;
  repoCommitSha?: string | null;
  deployerLaunchesCount?: number | null;
}


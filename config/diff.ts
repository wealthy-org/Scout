import type {
  DiffFieldKey,
  DiffBooleanTrigger,
  DiffThresholdConfig,
  DiffItem,
} from "@/types/diff";

export type {
  DiffFieldKey,
  DiffBooleanTrigger,
  DiffThresholdConfig,
  DiffItem,
};

export const DIFF_FDV_PCT = 10;
export const DIFF_LIQUIDITY_PCT = 15;
export const DIFF_SCORE_POINTS = 8;

export const DIFF_MARKET_APPEARED = "market_appeared" as const;
export const DIFF_CURVE_GRADUATED = "curve_graduated" as const;
export const DIFF_FEE_RECIPIENT_CHANGED = "fee_recipient_changed" as const;
export const DIFF_NEW_REPO_COMMIT = "new_repo_commit" as const;
export const DIFF_NEW_DEPLOYER_LAUNCH = "new_deployer_launch" as const;


export const DIFF_FIELD_KEYS = [
  "fdv",
  "liquidity",
  "deployer_score",
  DIFF_MARKET_APPEARED,
  DIFF_CURVE_GRADUATED,
  DIFF_FEE_RECIPIENT_CHANGED,
  DIFF_NEW_REPO_COMMIT,
  DIFF_NEW_DEPLOYER_LAUNCH,
] as const;

export const DIFF_BOOLEAN_TRIGGERS = [
  DIFF_MARKET_APPEARED,
  DIFF_CURVE_GRADUATED,
  DIFF_FEE_RECIPIENT_CHANGED,
  DIFF_NEW_REPO_COMMIT,
  DIFF_NEW_DEPLOYER_LAUNCH,
] as const;

export const DIFF_THRESHOLDS: DiffThresholdConfig = {
  fdv_pct: DIFF_FDV_PCT,
  liquidity_pct: DIFF_LIQUIDITY_PCT,
  score_points: DIFF_SCORE_POINTS,
};

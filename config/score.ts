import type {
  DeployerLabel,
  DeployerBand,
  DeployerScoreSignals,
  DeployerScoreResult,
  DeployerLaunchInput,
} from "@/types/score";

export type {
  DeployerLabel,
  DeployerBand,
  DeployerScoreSignals,
  DeployerScoreResult,
  DeployerLaunchInput,
};

export const WEIGHT_GRAD_RATE = 0.55 as const;
export const WEIGHT_NO_DOA = 0.25 as const;
export const WEIGHT_NO_BURST = 0.20 as const;

export const GRAD_NUMERATOR_ADD = 1 as const;
export const GRAD_DENOMINATOR_ADD = 3 as const;

export const SERIAL_ZERO_GRAD_CAP = 25 as const;
export const SERIAL_ZERO_GRAD_THRESHOLD = 6 as const;

export const LABEL_FRESH_MAX = 1 as const;
export const LABEL_REPEAT_MIN = 2 as const;
export const LABEL_REPEAT_MAX = 5 as const;
export const LABEL_SERIAL_MIN = 6 as const;

export const BAND_GREEN_MIN = 65 as const;
export const BAND_YELLOW_MIN = 35 as const;

export const SCORE_MIN = 0 as const;
export const SCORE_MAX = 100 as const;

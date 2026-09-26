import {
  WEIGHT_GRAD_RATE,
  WEIGHT_NO_DOA,
  WEIGHT_NO_BURST,
  GRAD_NUMERATOR_ADD,
  GRAD_DENOMINATOR_ADD,
  SERIAL_ZERO_GRAD_CAP,
  SERIAL_ZERO_GRAD_THRESHOLD,
  LABEL_FRESH_MAX,
  LABEL_REPEAT_MAX,
  BAND_GREEN_MIN,
  BAND_YELLOW_MIN,
  SCORE_MIN,
  SCORE_MAX,
} from "@/config/score";
import type {
  DeployerLabel,
  DeployerBand,
  DeployerScoreResult,
  DeployerLaunchInput,
} from "@/types/score";

export function calculateScore(
  launches: DeployerLaunchInput[] = [],
  options?: { isContract?: boolean }
): DeployerScoreResult {
  const totalLaunches = launches.length;

  let graduatedCount = 0;
  let doaCount = 0;
  let burstCount = 0;

  for (const launch of launches) {
    if (launch.graduated) {
      graduatedCount++;
    }
    if (launch.isDoa) {
      doaCount++;
    }
    if (launch.isBurst) {
      burstCount++;
    }
  }

  const gradRate = (graduatedCount + GRAD_NUMERATOR_ADD) / (totalLaunches + GRAD_DENOMINATOR_ADD);
  const doaRate = doaCount / Math.max(totalLaunches, 1);
  const burstRate = burstCount / Math.max(totalLaunches, 1);

  let raw = 100 * (
    WEIGHT_GRAD_RATE * gradRate +
    WEIGHT_NO_DOA * (1 - doaRate) +
    WEIGHT_NO_BURST * (1 - burstRate)
  );

  if (totalLaunches >= SERIAL_ZERO_GRAD_THRESHOLD && graduatedCount === 0) {
    raw = Math.min(raw, SERIAL_ZERO_GRAD_CAP);
  }

  const score = Math.min(Math.max(Math.round(raw), SCORE_MIN), SCORE_MAX);

  let label: DeployerLabel = "fresh";
  if (totalLaunches <= LABEL_FRESH_MAX) {
    label = "fresh";
  } else if (totalLaunches <= LABEL_REPEAT_MAX) {
    label = "repeat";
  } else {
    label = "serial";
  }

  let band: DeployerBand = "red";
  if (score >= BAND_GREEN_MIN) {
    band = "green";
  } else if (score >= BAND_YELLOW_MIN) {
    band = "yellow";
  } else {
    band = "red";
  }

  if (options?.isContract) {
    return {
      score: 0,
      label,
      band: "red",
      signals: {
        grad_rate: gradRate,
        doa_rate: doaRate,
        burst_rate: burstRate,
        total_launches: totalLaunches,
        graduated_count: graduatedCount,
      },
      isContract: true,
    };
  }

  return {
    score,
    label,
    band,
    signals: {
      grad_rate: gradRate,
      doa_rate: doaRate,
      burst_rate: burstRate,
      total_launches: totalLaunches,
      graduated_count: graduatedCount,
    },
    isContract: false,
  };
}

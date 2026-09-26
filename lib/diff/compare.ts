import {
  DIFF_FDV_PCT,
  DIFF_LIQUIDITY_PCT,
  DIFF_SCORE_POINTS,
  DIFF_MARKET_APPEARED,
  DIFF_CURVE_GRADUATED,
  DIFF_FEE_RECIPIENT_CHANGED,
  DIFF_NEW_REPO_COMMIT,
  DIFF_NEW_DEPLOYER_LAUNCH,
} from "@/config/diff";
import type { SnapshotData, DiffItem } from "@/types/diff";

export type { DiffItem };

export function compareSnapshots(
  prev?: SnapshotData | null,
  current?: SnapshotData | null
): DiffItem[] {
  if (!prev || !current) {
    return [];
  }

  const items: DiffItem[] = [];

  const prevFdv = prev.fdv ?? null;
  const currFdv = current.fdv ?? null;
  if (typeof prevFdv === "number" && typeof currFdv === "number") {
    const delta = currFdv - prevFdv;
    let pctDelta = 0;
    let exceeded = false;

    if (prevFdv !== 0) {
      pctDelta = Number(((delta / Math.abs(prevFdv)) * 100).toFixed(6));
      exceeded = Math.abs(pctDelta) >= DIFF_FDV_PCT;
    } else if (currFdv !== 0) {
      pctDelta = currFdv > 0 ? 100 : -100;
      exceeded = true;
    }

    if (exceeded) {
      items.push({
        field: "fdv",
        label: "FDV",
        oldVal: prevFdv,
        newVal: currFdv,
        delta,
        pctDelta,
        exceeded: true,
        isBooleanTrigger: false,
      });
    }
  }

  const prevLiq = prev.liquidity ?? null;
  const currLiq = current.liquidity ?? null;
  if (typeof prevLiq === "number" && typeof currLiq === "number") {
    const delta = currLiq - prevLiq;
    let pctDelta = 0;
    let exceeded = false;

    if (prevLiq !== 0) {
      pctDelta = Number(((delta / Math.abs(prevLiq)) * 100).toFixed(6));
      exceeded = Math.abs(pctDelta) >= DIFF_LIQUIDITY_PCT;
    } else if (currLiq !== 0) {
      pctDelta = currLiq > 0 ? 100 : -100;
      exceeded = true;
    }

    if (exceeded) {
      items.push({
        field: "liquidity",
        label: "Liquidity",
        oldVal: prevLiq,
        newVal: currLiq,
        delta,
        pctDelta,
        exceeded: true,
        isBooleanTrigger: false,
      });
    }
  }

  const prevScore = prev.deployer_score ?? null;
  const currScore = current.deployer_score ?? null;
  if (typeof prevScore === "number" && typeof currScore === "number") {
    const delta = currScore - prevScore;
    const exceeded = Math.abs(delta) >= DIFF_SCORE_POINTS;

    if (exceeded) {
      items.push({
        field: "deployer_score",
        label: "Deployer Score",
        oldVal: prevScore,
        newVal: currScore,
        delta,
        exceeded: true,
        isBooleanTrigger: false,
      });
    }
  }

  const marketAppeared =
    (current.market_appeared === true && !prev.market_appeared) ||
    (!prev.hasPool && Boolean(current.hasPool));
  if (marketAppeared) {
    items.push({
      field: DIFF_MARKET_APPEARED,
      label: "Market Appeared",
      oldVal: prev.market_appeared ?? prev.hasPool ?? false,
      newVal: current.market_appeared ?? current.hasPool ?? true,
      exceeded: true,
      isBooleanTrigger: true,
    });
  }

  const curveGraduated =
    (current.curve_graduated === true && !prev.curve_graduated) ||
    (prev.phase?.toLowerCase() === "curve" &&
      (current.phase?.toLowerCase() === "swept" ||
        current.phase?.toLowerCase() === "graduated"));
  if (curveGraduated) {
    items.push({
      field: DIFF_CURVE_GRADUATED,
      label: "Bonding Curve Graduated",
      oldVal: prev.phase ?? prev.curve_graduated ?? false,
      newVal: current.phase ?? current.curve_graduated ?? true,
      exceeded: true,
      isBooleanTrigger: true,
    });
  }

  const feeRecipientChanged =
    (current.fee_recipient_changed === true && !prev.fee_recipient_changed) ||
    Boolean(
      prev.feeRecipient &&
        current.feeRecipient &&
        prev.feeRecipient.toLowerCase() !== current.feeRecipient.toLowerCase()
    );
  if (feeRecipientChanged) {
    items.push({
      field: DIFF_FEE_RECIPIENT_CHANGED,
      label: "Fee Recipient Changed",
      oldVal: prev.feeRecipient ?? prev.fee_recipient_changed ?? false,
      newVal: current.feeRecipient ?? current.fee_recipient_changed ?? true,
      exceeded: true,
      isBooleanTrigger: true,
    });
  }

  const newRepoCommit =
    (current.new_repo_commit === true && !prev.new_repo_commit) ||
    Boolean(
      prev.repoCommitSha &&
        current.repoCommitSha &&
        prev.repoCommitSha !== current.repoCommitSha
    );
  if (newRepoCommit) {
    items.push({
      field: DIFF_NEW_REPO_COMMIT,
      label: "New Repository Commit",
      oldVal: prev.repoCommitSha ?? prev.new_repo_commit ?? false,
      newVal: current.repoCommitSha ?? current.new_repo_commit ?? true,
      exceeded: true,
      isBooleanTrigger: true,
    });
  }

  const launchCountDelta =
    typeof prev.deployerLaunchesCount === "number" &&
    typeof current.deployerLaunchesCount === "number"
      ? current.deployerLaunchesCount - prev.deployerLaunchesCount
      : undefined;
  const newDeployerLaunch =
    (current.new_deployer_launch === true && !prev.new_deployer_launch) ||
    (typeof launchCountDelta === "number" && launchCountDelta > 0);
  if (newDeployerLaunch) {
    items.push({
      field: DIFF_NEW_DEPLOYER_LAUNCH,
      label: "New Deployer Launch",
      oldVal: prev.deployerLaunchesCount ?? prev.new_deployer_launch ?? false,
      newVal:
        current.deployerLaunchesCount ?? current.new_deployer_launch ?? true,
      ...(typeof launchCountDelta === "number"
        ? { delta: launchCountDelta }
        : {}),
      exceeded: true,
      isBooleanTrigger: true,
    });
  }

  return items;
}

import { db } from "@/lib/db";
import {
  dossiers,
  deployerScores,
  deployerLaunches,
  snapshots,
  dossierLog,
  dossierItems,
  dossierQuestions,
  type Dossier,
  type DeployerScore,
  type DeployerLaunch,
  type Snapshot,
  type DossierLog,
  type DossierItem,
  type DossierQuestion,
} from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export interface RawDossierQueryResult {
  existingDossierRecords: Dossier[];
  userDossierRecord: Dossier | null;
  deployerAsDeployer: DeployerScore[];
  tokenLaunchRecord: DeployerLaunch | null;
  deployerScoreRecord: DeployerScore | null;
  deployerLaunchesList: DeployerLaunch[];
  latestSnapshots: Snapshot[];
  logs: DossierLog[];
  items: DossierItem[];
  questions: DossierQuestion[];
  resolvedDeployerAddress: string;
}

export async function queryDossierRawData(
  ca: string,
  userWalletAddress?: string
): Promise<RawDossierQueryResult> {
  const normalizedCA = ca.toLowerCase();

  const existingDossierRecords = await db
    .select()
    .from(dossiers)
    .where(eq(dossiers.contractAddress, normalizedCA))
    .limit(10);

  const userDossierRecord = userWalletAddress
    ? existingDossierRecords.find(
        (d) => d.walletAddress.toLowerCase() === userWalletAddress.toLowerCase()
      ) ?? null
    : existingDossierRecords[0] ?? null;

  const deployerAsDeployer = await db
    .select()
    .from(deployerScores)
    .where(eq(deployerScores.deployerAddress, normalizedCA))
    .limit(1);

  const tokenLaunchRecords = await db
    .select()
    .from(deployerLaunches)
    .where(eq(deployerLaunches.tokenAddress, normalizedCA))
    .limit(1);

  const tokenLaunchRecord = tokenLaunchRecords[0] ?? null;

  let latestSnapshots: Snapshot[] = [];
  let logs: DossierLog[] = [];
  let items: DossierItem[] = [];
  let questions: DossierQuestion[] = [];

  if (userDossierRecord) {
    latestSnapshots = await db
      .select()
      .from(snapshots)
      .where(eq(snapshots.dossierId, userDossierRecord.id))
      .orderBy(desc(snapshots.at))
      .limit(2);

    logs = await db
      .select()
      .from(dossierLog)
      .where(eq(dossierLog.dossierId, userDossierRecord.id))
      .orderBy(desc(dossierLog.at))
      .limit(200);

    items = await db
      .select()
      .from(dossierItems)
      .where(eq(dossierItems.dossierId, userDossierRecord.id));

    questions = await db
      .select()
      .from(dossierQuestions)
      .where(eq(dossierQuestions.dossierId, userDossierRecord.id));
  }

  let tokenDeployer = tokenLaunchRecord?.deployerAddress;
  if (!tokenDeployer && latestSnapshots.length > 0) {
    const chainJson = latestSnapshots[0]?.chainJson as { deployer?: string } | undefined;
    if (chainJson?.deployer) {
      tokenDeployer = chainJson.deployer;
    }
  }

  const resolvedDeployerAddress =
    tokenDeployer || "0x0000000000000000000000000000000000000001";

  const dScores = await db
    .select()
    .from(deployerScores)
    .where(eq(deployerScores.deployerAddress, resolvedDeployerAddress))
    .limit(1);

  const deployerScoreRecord = dScores[0] ?? null;

  const deployerLaunchesList = await db
    .select()
    .from(deployerLaunches)
    .where(eq(deployerLaunches.deployerAddress, resolvedDeployerAddress))
    .limit(40);

  return {
    existingDossierRecords,
    userDossierRecord,
    deployerAsDeployer,
    tokenLaunchRecord,
    deployerScoreRecord,
    deployerLaunchesList,
    latestSnapshots,
    logs,
    items,
    questions,
    resolvedDeployerAddress,
  };
}

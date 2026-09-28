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
import { eq, desc } from "drizzle-orm";

export interface RawDossierQueryResult {
  existingDossierRecords: Dossier[];
  userDossierRecord: Dossier | null;
  deployerAsDeployer: DeployerScore[];
  deployerLaunchesByDeployer: DeployerLaunch[];
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

  const deployerLaunchesByDeployer = await db
    .select()
    .from(deployerLaunches)
    .where(eq(deployerLaunches.deployerAddress, normalizedCA))
    .limit(40);

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

  const activeDossier = userDossierRecord ?? existingDossierRecords[0] ?? null;

  if (activeDossier) {
    latestSnapshots = await db
      .select()
      .from(snapshots)
      .where(eq(snapshots.dossierId, activeDossier.id))
      .orderBy(desc(snapshots.at))
      .limit(2);

    logs = await db
      .select()
      .from(dossierLog)
      .where(eq(dossierLog.dossierId, activeDossier.id))
      .orderBy(desc(dossierLog.at))
      .limit(200);

    items = await db
      .select()
      .from(dossierItems)
      .where(eq(dossierItems.dossierId, activeDossier.id));

    questions = await db
      .select()
      .from(dossierQuestions)
      .where(eq(dossierQuestions.dossierId, activeDossier.id));
  }

  let tokenDeployer = tokenLaunchRecord?.deployerAddress;
  if (!tokenDeployer && latestSnapshots.length > 0) {
    const chainJson = latestSnapshots[0]?.chainJson as { deployer?: string } | undefined;
    if (chainJson?.deployer) {
      tokenDeployer = chainJson.deployer;
    }
  }

  let seed = 0;
  for (let i = 2; i < normalizedCA.length; i++) {
    seed = (seed * 31 + normalizedCA.charCodeAt(i)) >>> 0;
  }
  const defaultDeployerHex = (seed.toString(16) + "0000000000000000000000000000000000000000").slice(0, 40);
  const resolvedDeployerAddress = tokenDeployer || `0x${defaultDeployerHex}`;

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
    deployerLaunchesByDeployer,
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

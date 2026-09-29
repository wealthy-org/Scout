import { db } from '@/lib/db';
import {
  users,
  dossiers,
  dossierItems,
  dossierQuestions,
  dossierLog,
  snapshots,
  publishedDossiers,
  deployerWatchlist,
  deployerScores,
  deployerLaunches,
  censusStats
} from '@/lib/db/schema';

export const mockData = {
  users: [
    {
      walletAddress: '0x1111111111111111111111111111111111111111',
      handle: '@scout_master'
    },
    {
      walletAddress: '0x2222222222222222222222222222222222222222',
      handle: '@alpha_hunter'
    }
  ],
  dossiers: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      walletAddress: '0x1111111111111111111111111111111111111111',
      chainId: 4663,
      contractAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      symbol: 'SCOUT',
      name: 'Scout Terminal',
      status: 'In position' as const,
      reason: 'Alpha tier terminal launch with strong community',
      thesis: 'Strong organic traction on Robinhood chain with active repo commits.',
      notes: '# Scout Protocol\nVerified clean contract code and active development.',
      decisionReason: 'Position entered at 25% curve progress'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      walletAddress: '0x1111111111111111111111111111111111111111',
      chainId: 4663,
      contractAddress: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      symbol: 'ROBIN',
      name: 'Robinhood Pepe',
      status: 'Watching' as const,
      reason: 'Monitoring initial bonding curve momentum',
      thesis: 'High bonding curve velocity and growing unique wallet count.',
      notes: 'Initial scan shows clean deployer profile.',
      decisionReason: 'Watching closely for fee recipient changes'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      walletAddress: '0x2222222222222222222222222222222222222222',
      chainId: 4663,
      contractAddress: '0xcccccccccccccccccccccccccccccccccccccccc',
      symbol: 'RUGPULL',
      name: 'Fast Rug',
      status: 'Passed' as const,
      reason: 'High risk serial deployer profile',
      thesis: 'Deployer has launched 10 prior tokens with 0 graduations.',
      notes: 'Serial zero-grad penalty triggered. Score capped at 25.',
      decisionReason: 'Deployer has 10 launches with 0 graduations.'
    }
  ],
  dossierItems: [
    {
      id: '55555555-0001-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      kind: 'pro' as const,
      text: 'High bonding curve velocity and liquidity depth',
      position: 0
    },
    {
      id: '55555555-0002-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      kind: 'pro' as const,
      text: 'Verified GitHub repository with active daily commits',
      position: 1
    },
    {
      id: '55555555-0003-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      kind: 'con' as const,
      text: 'Top 5 holders control 28% of tokens',
      position: 2
    },
    {
      id: '55555555-0004-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      kind: 'checked' as const,
      text: 'Contract bytecode scanned for mint and blacklist vulnerabilities',
      position: 3
    },
    {
      id: '55555555-0005-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      kind: 'source' as const,
      text: 'https://github.com/scout-org/scout-protocol',
      position: 4
    }
  ],
  dossierQuestions: [
    {
      id: '66666666-0001-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      text: 'Will fee recipient address be changed before graduation?',
      done: false,
      position: 0
    },
    {
      id: '66666666-0002-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      text: 'Has deployer launched on any other chain under different alias?',
      done: true,
      position: 1
    },
    {
      id: '66666666-0003-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      text: 'Is community Telegram group organic with real discussion?',
      done: false,
      position: 2
    }
  ],
  dossierLog: [
    {
      id: '77777777-0001-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      text: 'Dossier created for SCOUT token'
    },
    {
      id: '77777777-0002-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      text: 'Updated thesis with GitHub commit findings'
    }
  ],
  snapshots: [
    {
      id: '88888888-0001-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      chainJson: { phase: 'curve', block: 27027350 },
      marketJson: { fdv: 500000, liquidity: 80000 },
      reposJson: { commits: 120 },
      launchesJson: { total: 5 },
      launchTotal: 5,
      curveJson: { progress: 35 }
    },
    {
      id: '88888888-0002-0000-0000-000000000000',
      dossierId: '11111111-1111-1111-1111-111111111111',
      chainJson: { phase: 'curve', block: 27027900 },
      marketJson: { fdv: 750000, liquidity: 120000 },
      reposJson: { commits: 125 },
      launchesJson: { total: 5 },
      launchTotal: 5,
      curveJson: { progress: 65 }
    }
  ],
  publishedDossiers: [
    {
      slug: 'scout-terminal-analysis',
      dossierId: '11111111-1111-1111-1111-111111111111',
      authorHandle: '@scout_master',
      payloadJson: {
        symbol: 'SCOUT',
        thesis: 'Strong organic traction on Robinhood chain with active repo commits.'
      },
      revokedAt: null
    }
  ],
  deployerWatchlist: [
    {
      id: '99999999-0001-0000-0000-000000000000',
      walletAddress: '0x1111111111111111111111111111111111111111',
      deployerAddress: '0xd111111111111111111111111111111111111111'
    }
  ],
  deployerScores: [
    {
      deployerAddress: '0xd111111111111111111111111111111111111111',
      totalLaunches: 5,
      graduatedCount: 4,
      deadOnArrivalCount: 0,
      burstLaunches: 0,
      feeRecipientReuse: 1,
      score: 85,
      label: 'repeat' as const,
      band: 'green' as const
    },
    {
      deployerAddress: '0xd222222222222222222222222222222222222222',
      totalLaunches: 1,
      graduatedCount: 0,
      deadOnArrivalCount: 0,
      burstLaunches: 0,
      feeRecipientReuse: 0,
      score: 50,
      label: 'fresh' as const,
      band: 'yellow' as const
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      totalLaunches: 10,
      graduatedCount: 0,
      deadOnArrivalCount: 8,
      burstLaunches: 6,
      feeRecipientReuse: 4,
      score: 12,
      label: 'serial' as const,
      band: 'red' as const
    }
  ],
  deployerLaunches: [
    {
      deployerAddress: '0xd111111111111111111111111111111111111111',
      tokenAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      block: 27027350,
      phase: 'swept'
    },
    {
      deployerAddress: '0xd111111111111111111111111111111111111111',
      tokenAddress: '0xaaaa111111111111111111111111111111111111',
      block: 27025000,
      phase: 'graduated'
    },
    {
      deployerAddress: '0xd111111111111111111111111111111111111111',
      tokenAddress: '0xaaaa222222222222222222222222222222222222',
      block: 27023400,
      phase: 'graduated'
    },
    {
      deployerAddress: '0xd111111111111111111111111111111111111111',
      tokenAddress: '0xaaaa333333333333333333333333333333333333',
      block: 27021100,
      phase: 'graduated'
    },
    {
      deployerAddress: '0xd111111111111111111111111111111111111111',
      tokenAddress: '0xaaaa444444444444444444444444444444444444',
      block: 27019500,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd222222222222222222222222222222222222222',
      tokenAddress: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      block: 27028100,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccccccccccccccccccccccccccccccccccccccc',
      block: 27029000,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc111111111111111111111111111111111111',
      block: 27028900,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc222222222222222222222222222222222222',
      block: 27028800,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc333333333333333333333333333333333333',
      block: 27028700,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc444444444444444444444444444444444444',
      block: 27028500,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc555555555555555555555555555555555555',
      block: 27028400,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc666666666666666666666666666666666666',
      block: 27028300,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc777777777777777777777777777777777777',
      block: 27027500,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc888888888888888888888888888888888888',
      block: 27026500,
      phase: 'curve'
    },
    {
      deployerAddress: '0xd333333333333333333333333333333333333333',
      tokenAddress: '0xcccc999999999999999999999999999999999999',
      block: 27025500,
      phase: 'curve'
    }
  ],
  censusStats: {
    id: '44444444-4444-4444-4444-444444444444',
    headBlock: 27030000,
    totalLaunches: 150,
    uniqueDeployers: 42,
    repeatShare: '0.28',
    payloadJson: {
      activeTokens: 12,
      graduatedTokens: 8
    }
  }
};

export async function seedDatabase(targetDb = db) {
  for (const user of mockData.users) {
    await targetDb
      .insert(users)
      .values(user)
      .onConflictDoUpdate({ target: users.walletAddress, set: user });
  }

  for (const score of mockData.deployerScores) {
    await targetDb
      .insert(deployerScores)
      .values(score)
      .onConflictDoUpdate({ target: deployerScores.deployerAddress, set: score });
  }

  for (const launch of mockData.deployerLaunches) {
    await targetDb
      .insert(deployerLaunches)
      .values(launch)
      .onConflictDoUpdate({
        target: [deployerLaunches.deployerAddress, deployerLaunches.tokenAddress],
        set: launch
      });
  }

  for (const dossier of mockData.dossiers) {
    await targetDb
      .insert(dossiers)
      .values(dossier)
      .onConflictDoUpdate({ target: dossiers.id, set: dossier });
  }

  for (const item of mockData.dossierItems) {
    await targetDb
      .insert(dossierItems)
      .values(item)
      .onConflictDoUpdate({ target: dossierItems.id, set: item });
  }

  for (const q of mockData.dossierQuestions) {
    await targetDb
      .insert(dossierQuestions)
      .values(q)
      .onConflictDoUpdate({ target: dossierQuestions.id, set: q });
  }

  for (const log of mockData.dossierLog) {
    await targetDb
      .insert(dossierLog)
      .values(log)
      .onConflictDoUpdate({ target: dossierLog.id, set: log });
  }

  for (const snap of mockData.snapshots) {
    await targetDb
      .insert(snapshots)
      .values(snap)
      .onConflictDoUpdate({ target: snapshots.id, set: snap });
  }

  for (const pub of mockData.publishedDossiers) {
    await targetDb
      .insert(publishedDossiers)
      .values(pub)
      .onConflictDoUpdate({ target: publishedDossiers.slug, set: pub });
  }

  for (const watch of mockData.deployerWatchlist) {
    await targetDb
      .insert(deployerWatchlist)
      .values(watch)
      .onConflictDoUpdate({ target: deployerWatchlist.id, set: watch });
  }

  await targetDb
    .insert(censusStats)
    .values(mockData.censusStats)
    .onConflictDoUpdate({ target: censusStats.id, set: mockData.censusStats });
}

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

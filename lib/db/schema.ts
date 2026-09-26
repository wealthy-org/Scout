import {
  pgSchema,
  text,
  integer,
  bigint,
  numeric,
  boolean,
  timestamp,
  uuid,
  jsonb,
  unique,
  primaryKey,
  index
} from 'drizzle-orm/pg-core';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const scoutSchema = pgSchema('scout');

export const DOSSIER_STATUSES = ['Watching', 'Researching', 'In position', 'Passed'] as const;
export type DossierStatus = (typeof DOSSIER_STATUSES)[number];

export const DOSSIER_ITEM_KINDS = ['pro', 'con', 'checked', 'source'] as const;
export type DossierItemKind = (typeof DOSSIER_ITEM_KINDS)[number];

export const users = scoutSchema.table('users', {
  walletAddress: text('wallet_address').primaryKey(),
  handle: text('handle'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const dossiers = scoutSchema.table(
  'dossiers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    walletAddress: text('wallet_address')
      .notNull()
      .references(() => users.walletAddress, { onDelete: 'cascade' }),
    chainId: integer('chain_id').notNull(),
    contractAddress: text('contract_address').notNull(),
    symbol: text('symbol'),
    name: text('name'),
    status: text('status').$type<DossierStatus>(),
    reason: text('reason'),
    thesis: text('thesis'),
    notes: text('notes'),
    decisionReason: text('decision_reason'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    originAuthor: text('origin_author'),
    originAt: timestamp('origin_at', { withTimezone: true, mode: 'date' })
  },
  (table) => [
    unique('dossiers_wallet_chain_contract_uniq').on(
      table.walletAddress,
      table.chainId,
      table.contractAddress
    ),
    index('dossiers_wallet_address_idx').on(table.walletAddress),
    index('dossiers_contract_address_idx').on(table.contractAddress)
  ]
);

export const dossierItems = scoutSchema.table(
  'dossier_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    dossierId: uuid('dossier_id')
      .notNull()
      .references(() => dossiers.id, { onDelete: 'cascade' }),
    kind: text('kind').$type<DossierItemKind>().notNull(),
    text: text('text').notNull(),
    position: integer('position').default(0).notNull()
  },
  (table) => [index('dossier_items_dossier_id_idx').on(table.dossierId)]
);

export const dossierQuestions = scoutSchema.table(
  'dossier_questions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    dossierId: uuid('dossier_id')
      .notNull()
      .references(() => dossiers.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    done: boolean('done').default(false).notNull(),
    position: integer('position').default(0).notNull()
  },
  (table) => [index('dossier_questions_dossier_id_idx').on(table.dossierId)]
);

export const dossierLog = scoutSchema.table(
  'dossier_log',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    dossierId: uuid('dossier_id')
      .notNull()
      .references(() => dossiers.id, { onDelete: 'cascade' }),
    at: timestamp('at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    text: text('text').notNull()
  },
  (table) => [index('dossier_log_dossier_id_idx').on(table.dossierId)]
);

export const snapshots = scoutSchema.table(
  'snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    dossierId: uuid('dossier_id')
      .notNull()
      .references(() => dossiers.id, { onDelete: 'cascade' }),
    at: timestamp('at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    chainJson: jsonb('chain_json'),
    marketJson: jsonb('market_json'),
    reposJson: jsonb('repos_json'),
    launchesJson: jsonb('launches_json'),
    launchTotal: integer('launch_total'),
    curveJson: jsonb('curve_json')
  },
  (table) => [index('snapshots_dossier_id_idx').on(table.dossierId)]
);

export const publishedDossiers = scoutSchema.table(
  'published_dossiers',
  {
    slug: text('slug').primaryKey(),
    dossierId: uuid('dossier_id').references(() => dossiers.id, { onDelete: 'set null' }),
    authorHandle: text('author_handle'),
    payloadJson: jsonb('payload_json').notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true, mode: 'date' })
  },
  (table) => [
    index('published_dossiers_slug_idx').on(table.slug),
    index('published_dossiers_dossier_id_idx').on(table.dossierId)
  ]
);

export const deployerWatchlist = scoutSchema.table(
  'deployer_watchlist',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    walletAddress: text('wallet_address')
      .notNull()
      .references(() => users.walletAddress, { onDelete: 'cascade' }),
    deployerAddress: text('deployer_address').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    unique('deployer_watchlist_wallet_deployer_uniq').on(
      table.walletAddress,
      table.deployerAddress
    ),
    index('deployer_watchlist_wallet_address_idx').on(table.walletAddress),
    index('deployer_watchlist_deployer_address_idx').on(table.deployerAddress)
  ]
);

export const deployerScores = scoutSchema.table(
  'deployer_scores',
  {
    deployerAddress: text('deployer_address').primaryKey(),
    totalLaunches: integer('total_launches').default(0).notNull(),
    graduatedCount: integer('graduated_count').default(0).notNull(),
    deadOnArrivalCount: integer('dead_on_arrival_count').default(0).notNull(),
    burstLaunches: integer('burst_launches').default(0).notNull(),
    feeRecipientReuse: integer('fee_recipient_reuse').default(0).notNull(),
    score: integer('score').default(0).notNull(),
    label: text('label').$type<'fresh' | 'repeat' | 'serial'>().default('fresh').notNull(),
    band: text('band').$type<'green' | 'yellow' | 'red'>().default('yellow').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
  },
  (table) => [
    index('deployer_scores_score_idx').on(table.score),
    index('deployer_scores_band_idx').on(table.band)
  ]
);

export const deployerLaunches = scoutSchema.table(
  'deployer_launches',
  {
    deployerAddress: text('deployer_address').notNull(),
    tokenAddress: text('token_address').notNull(),
    block: bigint('block', { mode: 'number' }),
    phase: text('phase')
  },
  (table) => [
    primaryKey({ columns: [table.deployerAddress, table.tokenAddress] }),
    index('deployer_launches_deployer_address_idx').on(table.deployerAddress),
    index('deployer_launches_token_address_idx').on(table.tokenAddress)
  ]
);

export const censusStats = scoutSchema.table('census_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  computedAt: timestamp('computed_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  headBlock: bigint('head_block', { mode: 'number' }),
  totalLaunches: integer('total_launches').default(0).notNull(),
  uniqueDeployers: integer('unique_deployers').default(0).notNull(),
  repeatShare: numeric('repeat_share'),
  payloadJson: jsonb('payload_json')
});

export const usersRelations = relations(users, ({ many }) => ({
  dossiers: many(dossiers),
  watchlist: many(deployerWatchlist)
}));

export const dossiersRelations = relations(dossiers, ({ one, many }) => ({
  user: one(users, {
    fields: [dossiers.walletAddress],
    references: [users.walletAddress]
  }),
  items: many(dossierItems),
  questions: many(dossierQuestions),
  logs: many(dossierLog),
  snapshots: many(snapshots),
  published: one(publishedDossiers, {
    fields: [dossiers.id],
    references: [publishedDossiers.dossierId]
  })
}));

export const dossierItemsRelations = relations(dossierItems, ({ one }) => ({
  dossier: one(dossiers, {
    fields: [dossierItems.dossierId],
    references: [dossiers.id]
  })
}));

export const dossierQuestionsRelations = relations(dossierQuestions, ({ one }) => ({
  dossier: one(dossiers, {
    fields: [dossierQuestions.dossierId],
    references: [dossiers.id]
  })
}));

export const dossierLogRelations = relations(dossierLog, ({ one }) => ({
  dossier: one(dossiers, {
    fields: [dossierLog.dossierId],
    references: [dossiers.id]
  })
}));

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  dossier: one(dossiers, {
    fields: [snapshots.dossierId],
    references: [dossiers.id]
  })
}));

export const publishedDossiersRelations = relations(publishedDossiers, ({ one }) => ({
  dossier: one(dossiers, {
    fields: [publishedDossiers.dossierId],
    references: [dossiers.id]
  })
}));

export const deployerWatchlistRelations = relations(deployerWatchlist, ({ one }) => ({
  user: one(users, {
    fields: [deployerWatchlist.walletAddress],
    references: [users.walletAddress]
  })
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Dossier = InferSelectModel<typeof dossiers>;
export type NewDossier = InferInsertModel<typeof dossiers>;

export type DossierItem = InferSelectModel<typeof dossierItems>;
export type NewDossierItem = InferInsertModel<typeof dossierItems>;

export type DossierQuestion = InferSelectModel<typeof dossierQuestions>;
export type NewDossierQuestion = InferInsertModel<typeof dossierQuestions>;

export type DossierLog = InferSelectModel<typeof dossierLog>;
export type NewDossierLog = InferInsertModel<typeof dossierLog>;

export type Snapshot = InferSelectModel<typeof snapshots>;
export type NewSnapshot = InferInsertModel<typeof snapshots>;

export type PublishedDossier = InferSelectModel<typeof publishedDossiers>;
export type NewPublishedDossier = InferInsertModel<typeof publishedDossiers>;

export type DeployerWatchlist = InferSelectModel<typeof deployerWatchlist>;
export type NewDeployerWatchlist = InferInsertModel<typeof deployerWatchlist>;

export type DeployerScore = InferSelectModel<typeof deployerScores>;
export type NewDeployerScore = InferInsertModel<typeof deployerScores>;

export type DeployerLaunch = InferSelectModel<typeof deployerLaunches>;
export type NewDeployerLaunch = InferInsertModel<typeof deployerLaunches>;

export type CensusStats = InferSelectModel<typeof censusStats>;
export type NewCensusStats = InferInsertModel<typeof censusStats>;

CREATE SCHEMA IF NOT EXISTS "scout";
--> statement-breakpoint
CREATE TABLE "scout"."census_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"head_block" bigint,
	"total_launches" integer DEFAULT 0 NOT NULL,
	"unique_deployers" integer DEFAULT 0 NOT NULL,
	"repeat_share" numeric,
	"payload_json" jsonb
);
--> statement-breakpoint
CREATE TABLE "scout"."deployer_launches" (
	"deployer_address" text NOT NULL,
	"token_address" text NOT NULL,
	"block" bigint,
	"phase" text,
	CONSTRAINT "deployer_launches_deployer_address_token_address_pk" PRIMARY KEY("deployer_address","token_address")
);
--> statement-breakpoint
CREATE TABLE "scout"."deployer_scores" (
	"deployer_address" text PRIMARY KEY NOT NULL,
	"total_launches" integer DEFAULT 0 NOT NULL,
	"graduated_count" integer DEFAULT 0 NOT NULL,
	"dead_on_arrival_count" integer DEFAULT 0 NOT NULL,
	"burst_launches" integer DEFAULT 0 NOT NULL,
	"fee_recipient_reuse" integer DEFAULT 0 NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"label" text DEFAULT 'fresh' NOT NULL,
	"band" text DEFAULT 'yellow' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scout"."deployer_watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"deployer_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deployer_watchlist_wallet_deployer_uniq" UNIQUE("wallet_address","deployer_address")
);
--> statement-breakpoint
CREATE TABLE "scout"."dossier_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dossier_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"text" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scout"."dossier_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dossier_id" uuid NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scout"."dossier_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dossier_id" uuid NOT NULL,
	"text" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scout"."dossiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"chain_id" integer NOT NULL,
	"contract_address" text NOT NULL,
	"symbol" text,
	"name" text,
	"status" text,
	"reason" text,
	"thesis" text,
	"notes" text,
	"decision_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"origin_author" text,
	"origin_at" timestamp with time zone,
	CONSTRAINT "dossiers_wallet_chain_contract_uniq" UNIQUE("wallet_address","chain_id","contract_address")
);
--> statement-breakpoint
CREATE TABLE "scout"."published_dossiers" (
	"slug" text PRIMARY KEY NOT NULL,
	"dossier_id" uuid,
	"author_handle" text,
	"payload_json" jsonb NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "scout"."snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dossier_id" uuid NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"chain_json" jsonb,
	"market_json" jsonb,
	"repos_json" jsonb,
	"launches_json" jsonb,
	"launch_total" integer,
	"curve_json" jsonb
);
--> statement-breakpoint
CREATE TABLE "scout"."users" (
	"wallet_address" text PRIMARY KEY NOT NULL,
	"handle" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scout"."deployer_watchlist" ADD CONSTRAINT "deployer_watchlist_wallet_address_users_wallet_address_fk" FOREIGN KEY ("wallet_address") REFERENCES "scout"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scout"."dossier_items" ADD CONSTRAINT "dossier_items_dossier_id_dossiers_id_fk" FOREIGN KEY ("dossier_id") REFERENCES "scout"."dossiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scout"."dossier_log" ADD CONSTRAINT "dossier_log_dossier_id_dossiers_id_fk" FOREIGN KEY ("dossier_id") REFERENCES "scout"."dossiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scout"."dossier_questions" ADD CONSTRAINT "dossier_questions_dossier_id_dossiers_id_fk" FOREIGN KEY ("dossier_id") REFERENCES "scout"."dossiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scout"."dossiers" ADD CONSTRAINT "dossiers_wallet_address_users_wallet_address_fk" FOREIGN KEY ("wallet_address") REFERENCES "scout"."users"("wallet_address") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scout"."published_dossiers" ADD CONSTRAINT "published_dossiers_dossier_id_dossiers_id_fk" FOREIGN KEY ("dossier_id") REFERENCES "scout"."dossiers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scout"."snapshots" ADD CONSTRAINT "snapshots_dossier_id_dossiers_id_fk" FOREIGN KEY ("dossier_id") REFERENCES "scout"."dossiers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "deployer_launches_deployer_address_idx" ON "scout"."deployer_launches" USING btree ("deployer_address");--> statement-breakpoint
CREATE INDEX "deployer_launches_token_address_idx" ON "scout"."deployer_launches" USING btree ("token_address");--> statement-breakpoint
CREATE INDEX "deployer_scores_score_idx" ON "scout"."deployer_scores" USING btree ("score");--> statement-breakpoint
CREATE INDEX "deployer_scores_band_idx" ON "scout"."deployer_scores" USING btree ("band");--> statement-breakpoint
CREATE INDEX "deployer_watchlist_wallet_address_idx" ON "scout"."deployer_watchlist" USING btree ("wallet_address");--> statement-breakpoint
CREATE INDEX "deployer_watchlist_deployer_address_idx" ON "scout"."deployer_watchlist" USING btree ("deployer_address");--> statement-breakpoint
CREATE INDEX "dossier_items_dossier_id_idx" ON "scout"."dossier_items" USING btree ("dossier_id");--> statement-breakpoint
CREATE INDEX "dossier_log_dossier_id_idx" ON "scout"."dossier_log" USING btree ("dossier_id");--> statement-breakpoint
CREATE INDEX "dossier_questions_dossier_id_idx" ON "scout"."dossier_questions" USING btree ("dossier_id");--> statement-breakpoint
CREATE INDEX "dossiers_wallet_address_idx" ON "scout"."dossiers" USING btree ("wallet_address");--> statement-breakpoint
CREATE INDEX "dossiers_contract_address_idx" ON "scout"."dossiers" USING btree ("contract_address");--> statement-breakpoint
CREATE INDEX "published_dossiers_slug_idx" ON "scout"."published_dossiers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "published_dossiers_dossier_id_idx" ON "scout"."published_dossiers" USING btree ("dossier_id");--> statement-breakpoint
CREATE INDEX "snapshots_dossier_id_idx" ON "scout"."snapshots" USING btree ("dossier_id");
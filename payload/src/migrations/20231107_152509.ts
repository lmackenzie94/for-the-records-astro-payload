import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

ALTER TABLE "records" ADD COLUMN "content_html" varchar;
ALTER TABLE "artists" ADD COLUMN "content_html" varchar;
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "users" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "media" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "records" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "artists" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "genres" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "payload_preferences" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "payload_migrations" ("created_at");`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP INDEX IF EXISTS "created_at_idx";
ALTER TABLE "records" DROP COLUMN IF EXISTS "content_html";
ALTER TABLE "artists" DROP COLUMN IF EXISTS "content_html";`);

};

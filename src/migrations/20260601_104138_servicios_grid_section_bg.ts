import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_services_grid" ADD COLUMN "background_color" varchar DEFAULT '#ffffff';
  ALTER TABLE "_pages_v_blocks_services_grid" ADD COLUMN "background_color" varchar DEFAULT '#ffffff';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_services_grid" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_services_grid" DROP COLUMN "background_color";`)
}

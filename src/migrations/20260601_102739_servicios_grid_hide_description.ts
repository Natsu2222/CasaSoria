import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_services_grid_services" ADD COLUMN "hide_description_until_hover" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD COLUMN "hide_description_until_hover" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_services_grid_services" DROP COLUMN "hide_description_until_hover";
  ALTER TABLE "_pages_v_blocks_services_grid_services" DROP COLUMN "hide_description_until_hover";`)
}

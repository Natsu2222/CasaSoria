import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_background_move_value" numeric DEFAULT 3;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_mobile_background_color" varchar DEFAULT '#FFC950';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_background_move_value" numeric DEFAULT 3;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_mobile_background_color" varchar DEFAULT '#FFC950';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_background_move_value";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_mobile_background_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_background_move_value";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_mobile_background_color";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_base_color" varchar DEFAULT '#1e1e1c';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_fill_color" varchar DEFAULT '#f3f3f3';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_text_color" varchar DEFAULT '#f3f3f3';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_hover_text_color" varchar DEFAULT '#1e1e1c';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_base_color" varchar DEFAULT '#1e1e1c';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_fill_color" varchar DEFAULT '#f3f3f3';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_text_color" varchar DEFAULT '#f3f3f3';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_hover_text_color" varchar DEFAULT '#1e1e1c';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_base_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_fill_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_text_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_hover_text_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_base_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_fill_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_text_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_hover_text_color";`)
}

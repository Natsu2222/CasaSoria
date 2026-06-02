import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_hero_parallax2_mobile_text_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_parallax2_mobile_text_align" AS ENUM('center', 'left');
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax2_mobile_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax2_mobile_text_align" "enum_pages_hero_hero_parallax2_mobile_text_align" DEFAULT 'center';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax2_mobile_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax2_mobile_text_align" "enum__pages_v_version_hero_hero_parallax2_mobile_text_align" DEFAULT 'center';
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_parallax2_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_hero_parallax2_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax2_mobile_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_parallax2_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_parallax2_hero_hero_parallax2_mobile_ima_idx" ON "pages" USING btree ("hero_hero_parallax2_mobile_image_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax2_version_hero_hero_1_idx" ON "_pages_v" USING btree ("version_hero_hero_parallax2_mobile_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_hero_parallax2_mobile_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_hero_parallax2_mobile_image_id_media_id_fk";
  
  DROP INDEX "pages_hero_hero_parallax2_hero_hero_parallax2_mobile_ima_idx";
  DROP INDEX "_pages_v_version_hero_hero_parallax2_version_hero_hero_1_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax2_mobile_image_id";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax2_mobile_text_align";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax2_mobile_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax2_mobile_text_align";
  DROP TYPE "public"."enum_pages_hero_hero_parallax2_mobile_text_align";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_parallax2_mobile_text_align";`)
}

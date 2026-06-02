import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_hero_parallax3_mobile_text_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_pages_hero_hero_parallax3_height" AS ENUM('500', '600', '700', '100vh');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_parallax3_mobile_text_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_parallax3_height" AS ENUM('500', '600', '700', '100vh');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'heroParallax3';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'heroParallax3';
  CREATE TABLE "pages_hero_hero_parallax3_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"move_value" numeric DEFAULT 5,
  	"opacity" numeric DEFAULT 1
  );
  
  CREATE TABLE "_pages_v_version_hero_hero_parallax3_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"move_value" numeric DEFAULT 5,
  	"opacity" numeric DEFAULT 1,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_title" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_subtitle" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_label" varchar DEFAULT '¿Hablamos?';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_url" varchar DEFAULT '/contacto';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_cta_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_left_background_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_text_color" varchar DEFAULT '#171714';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_background_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_mobile_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_mobile_text_align" "enum_pages_hero_hero_parallax3_mobile_text_align" DEFAULT 'center';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax3_height" "enum_pages_hero_hero_parallax3_height" DEFAULT '600';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_title" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_subtitle" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_label" varchar DEFAULT '¿Hablamos?';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_url" varchar DEFAULT '/contacto';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_cta_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_left_background_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_text_color" varchar DEFAULT '#171714';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_background_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_mobile_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_mobile_text_align" "enum__pages_v_version_hero_hero_parallax3_mobile_text_align" DEFAULT 'center';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax3_height" "enum__pages_v_version_hero_hero_parallax3_height" DEFAULT '600';
  ALTER TABLE "pages_hero_hero_parallax3_layers" ADD CONSTRAINT "pages_hero_hero_parallax3_layers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_hero_parallax3_layers" ADD CONSTRAINT "pages_hero_hero_parallax3_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_parallax3_layers" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax3_layers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_parallax3_layers" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax3_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_parallax3_layers_order_idx" ON "pages_hero_hero_parallax3_layers" USING btree ("_order");
  CREATE INDEX "pages_hero_hero_parallax3_layers_parent_id_idx" ON "pages_hero_hero_parallax3_layers" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_hero_parallax3_layers_image_idx" ON "pages_hero_hero_parallax3_layers" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax3_layers_order_idx" ON "_pages_v_version_hero_hero_parallax3_layers" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_hero_parallax3_layers_parent_id_idx" ON "_pages_v_version_hero_hero_parallax3_layers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax3_layers_image_idx" ON "_pages_v_version_hero_hero_parallax3_layers" USING btree ("image_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_parallax3_left_background_image_id_media_id_fk" FOREIGN KEY ("hero_hero_parallax3_left_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_parallax3_background_image_id_media_id_fk" FOREIGN KEY ("hero_hero_parallax3_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_hero_parallax3_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_hero_parallax3_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax3_left_background_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_parallax3_left_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax3_background_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_parallax3_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax3_mobile_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_parallax3_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_parallax3_hero_hero_parallax3_left_backg_idx" ON "pages" USING btree ("hero_hero_parallax3_left_background_image_id");
  CREATE INDEX "pages_hero_hero_parallax3_hero_hero_parallax3_background_idx" ON "pages" USING btree ("hero_hero_parallax3_background_image_id");
  CREATE INDEX "pages_hero_hero_parallax3_hero_hero_parallax3_mobile_ima_idx" ON "pages" USING btree ("hero_hero_parallax3_mobile_image_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax3_version_hero_hero_p_idx" ON "_pages_v" USING btree ("version_hero_hero_parallax3_left_background_image_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax3_version_hero_hero_1_idx" ON "_pages_v" USING btree ("version_hero_hero_parallax3_background_image_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax3_version_hero_hero_2_idx" ON "_pages_v" USING btree ("version_hero_hero_parallax3_mobile_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_hero_parallax3_layers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_hero_parallax3_layers" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_hero_parallax3_layers" CASCADE;
  DROP TABLE "_pages_v_version_hero_hero_parallax3_layers" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_hero_parallax3_left_background_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_hero_parallax3_background_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_hero_parallax3_mobile_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_hero_parallax3_left_background_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_hero_parallax3_background_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_hero_parallax3_mobile_image_id_media_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'microVisuals', 'heroSoria', 'heroParallax', 'heroParallax2');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'microVisuals', 'heroSoria', 'heroParallax', 'heroParallax2');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_hero_parallax3_hero_hero_parallax3_left_backg_idx";
  DROP INDEX "pages_hero_hero_parallax3_hero_hero_parallax3_background_idx";
  DROP INDEX "pages_hero_hero_parallax3_hero_hero_parallax3_mobile_ima_idx";
  DROP INDEX "_pages_v_version_hero_hero_parallax3_version_hero_hero_p_idx";
  DROP INDEX "_pages_v_version_hero_hero_parallax3_version_hero_hero_1_idx";
  DROP INDEX "_pages_v_version_hero_hero_parallax3_version_hero_hero_2_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_title";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_subtitle";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_label";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_url";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_cta_open_in_new_tab";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_left_background_image_id";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_text_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_background_image_id";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_mobile_image_id";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_mobile_text_align";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax3_height";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_subtitle";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_cta_open_in_new_tab";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_left_background_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_text_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_background_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_mobile_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_mobile_text_align";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax3_height";
  DROP TYPE "public"."enum_pages_hero_hero_parallax3_mobile_text_align";
  DROP TYPE "public"."enum_pages_hero_hero_parallax3_height";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_parallax3_mobile_text_align";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_parallax3_height";`)
}

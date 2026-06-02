import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_hero_parallax_layers_object_fit" AS ENUM('cover', 'contain', 'fill');
  CREATE TYPE "public"."enum_pages_hero_hero_parallax_height" AS ENUM('screen', 'large', 'medium');
  CREATE TYPE "public"."enum_pages_hero_hero_parallax_text_align" AS ENUM('center', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_parallax_layers_object_fit" AS ENUM('cover', 'contain', 'fill');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_parallax_height" AS ENUM('screen', 'large', 'medium');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_parallax_text_align" AS ENUM('center', 'left', 'right');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'heroParallax';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'heroParallax';
  CREATE TABLE "pages_hero_hero_parallax_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"speed" numeric DEFAULT 0.3,
  	"object_fit" "enum_pages_hero_hero_parallax_layers_object_fit" DEFAULT 'cover',
  	"opacity" numeric DEFAULT 1
  );
  
  CREATE TABLE "_pages_v_version_hero_hero_parallax_layers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"speed" numeric DEFAULT 0.3,
  	"object_fit" "enum__pages_v_version_hero_hero_parallax_layers_object_fit" DEFAULT 'cover',
  	"opacity" numeric DEFAULT 1,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_subtitle" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_cta_label" varchar DEFAULT '¿Hablamos?';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_cta_url" varchar DEFAULT '/contacto';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_cta_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_overlay_opacity" numeric DEFAULT 0.5;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_height" "enum_pages_hero_hero_parallax_height" DEFAULT 'screen';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_parallax_text_align" "enum_pages_hero_hero_parallax_text_align" DEFAULT 'center';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_subtitle" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_cta_label" varchar DEFAULT '¿Hablamos?';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_cta_url" varchar DEFAULT '/contacto';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_cta_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_overlay_opacity" numeric DEFAULT 0.5;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_height" "enum__pages_v_version_hero_hero_parallax_height" DEFAULT 'screen';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_parallax_text_align" "enum__pages_v_version_hero_hero_parallax_text_align" DEFAULT 'center';
  ALTER TABLE "pages_hero_hero_parallax_layers" ADD CONSTRAINT "pages_hero_hero_parallax_layers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_hero_parallax_layers" ADD CONSTRAINT "pages_hero_hero_parallax_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_parallax_layers" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax_layers_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_parallax_layers" ADD CONSTRAINT "_pages_v_version_hero_hero_parallax_layers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_parallax_layers_order_idx" ON "pages_hero_hero_parallax_layers" USING btree ("_order");
  CREATE INDEX "pages_hero_hero_parallax_layers_parent_id_idx" ON "pages_hero_hero_parallax_layers" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_hero_parallax_layers_image_idx" ON "pages_hero_hero_parallax_layers" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax_layers_order_idx" ON "_pages_v_version_hero_hero_parallax_layers" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_hero_parallax_layers_parent_id_idx" ON "_pages_v_version_hero_hero_parallax_layers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_hero_parallax_layers_image_idx" ON "_pages_v_version_hero_hero_parallax_layers" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_hero_parallax_layers" CASCADE;
  DROP TABLE "_pages_v_version_hero_hero_parallax_layers" CASCADE;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'microVisuals', 'heroSoria');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'microVisuals', 'heroSoria');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_title";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_subtitle";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_cta_label";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_cta_url";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_cta_open_in_new_tab";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_overlay_opacity";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_height";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_parallax_text_align";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_subtitle";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_cta_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_cta_url";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_cta_open_in_new_tab";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_overlay_opacity";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_height";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_parallax_text_align";
  DROP TYPE "public"."enum_pages_hero_hero_parallax_layers_object_fit";
  DROP TYPE "public"."enum_pages_hero_hero_parallax_height";
  DROP TYPE "public"."enum_pages_hero_hero_parallax_text_align";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_parallax_layers_object_fit";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_parallax_height";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_parallax_text_align";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_hero_soria_buttons_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_hero_soria_buttons_appearance" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_hero_hero_soria_buttons_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_hero_hero_soria_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_hero_hero_soria_subtitle_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_hero_hero_soria_eyebrow_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_soria_buttons_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_soria_buttons_appearance" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_soria_buttons_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_soria_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_soria_subtitle_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_version_hero_hero_soria_eyebrow_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'heroSoria';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'heroSoria';
  CREATE TABLE "pages_hero_hero_soria_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_hero_soria_buttons_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"appearance" "enum_pages_hero_hero_soria_buttons_appearance" DEFAULT 'primary',
  	"font_family" "enum_pages_hero_hero_soria_buttons_font_family" DEFAULT 'default',
  	"background_color" varchar,
  	"text_color" varchar
  );
  
  CREATE TABLE "pages_hero_hero_soria_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"rotation" numeric,
  	"alt" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_hero_soria_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_hero_soria_buttons_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"appearance" "enum__pages_v_version_hero_hero_soria_buttons_appearance" DEFAULT 'primary',
  	"font_family" "enum__pages_v_version_hero_hero_soria_buttons_font_family" DEFAULT 'default',
  	"background_color" varchar,
  	"text_color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_hero_soria_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"rotation" numeric,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_eyebrow" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_title" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_subtitle" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_title_color" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_title_font_family" "enum_pages_hero_hero_soria_title_font_family" DEFAULT 'default';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_subtitle_color" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_subtitle_font_family" "enum_pages_hero_hero_soria_subtitle_font_family" DEFAULT 'default';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_eyebrow_color" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_eyebrow_font_family" "enum_pages_hero_hero_soria_eyebrow_font_family" DEFAULT 'default';
  ALTER TABLE "pages" ADD COLUMN "hero_hero_soria_background_color" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_eyebrow" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_title" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_subtitle" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_title_color" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_title_font_family" "enum__pages_v_version_hero_hero_soria_title_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_subtitle_color" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_subtitle_font_family" "enum__pages_v_version_hero_hero_soria_subtitle_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_eyebrow_color" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_eyebrow_font_family" "enum__pages_v_version_hero_hero_soria_eyebrow_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_hero_soria_background_color" varchar;
  ALTER TABLE "pages_hero_hero_soria_buttons" ADD CONSTRAINT "pages_hero_hero_soria_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_hero_soria_gallery" ADD CONSTRAINT "pages_hero_hero_soria_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_hero_soria_gallery" ADD CONSTRAINT "pages_hero_hero_soria_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_soria_buttons" ADD CONSTRAINT "_pages_v_version_hero_hero_soria_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_soria_gallery" ADD CONSTRAINT "_pages_v_version_hero_hero_soria_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_hero_soria_gallery" ADD CONSTRAINT "_pages_v_version_hero_hero_soria_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_soria_buttons_order_idx" ON "pages_hero_hero_soria_buttons" USING btree ("_order");
  CREATE INDEX "pages_hero_hero_soria_buttons_parent_id_idx" ON "pages_hero_hero_soria_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_hero_soria_gallery_order_idx" ON "pages_hero_hero_soria_gallery" USING btree ("_order");
  CREATE INDEX "pages_hero_hero_soria_gallery_parent_id_idx" ON "pages_hero_hero_soria_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_hero_soria_gallery_image_idx" ON "pages_hero_hero_soria_gallery" USING btree ("image_id");
  CREATE INDEX "_pages_v_version_hero_hero_soria_buttons_order_idx" ON "_pages_v_version_hero_hero_soria_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_hero_soria_buttons_parent_id_idx" ON "_pages_v_version_hero_hero_soria_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_hero_soria_gallery_order_idx" ON "_pages_v_version_hero_hero_soria_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_hero_soria_gallery_parent_id_idx" ON "_pages_v_version_hero_hero_soria_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_hero_soria_gallery_image_idx" ON "_pages_v_version_hero_hero_soria_gallery" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_hero_soria_buttons" CASCADE;
  DROP TABLE "pages_hero_hero_soria_gallery" CASCADE;
  DROP TABLE "_pages_v_version_hero_hero_soria_buttons" CASCADE;
  DROP TABLE "_pages_v_version_hero_hero_soria_gallery" CASCADE;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'microVisuals');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'microVisuals');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_title";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_subtitle";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_title_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_title_font_family";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_subtitle_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_subtitle_font_family";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_eyebrow_color";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_eyebrow_font_family";
  ALTER TABLE "pages" DROP COLUMN "hero_hero_soria_background_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_eyebrow";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_subtitle";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_title_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_title_font_family";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_subtitle_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_subtitle_font_family";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_eyebrow_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_eyebrow_font_family";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_hero_soria_background_color";
  DROP TYPE "public"."enum_pages_hero_hero_soria_buttons_link_type";
  DROP TYPE "public"."enum_pages_hero_hero_soria_buttons_appearance";
  DROP TYPE "public"."enum_pages_hero_hero_soria_buttons_font_family";
  DROP TYPE "public"."enum_pages_hero_hero_soria_title_font_family";
  DROP TYPE "public"."enum_pages_hero_hero_soria_subtitle_font_family";
  DROP TYPE "public"."enum_pages_hero_hero_soria_eyebrow_font_family";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_soria_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_soria_buttons_appearance";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_soria_buttons_font_family";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_soria_title_font_family";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_soria_subtitle_font_family";
  DROP TYPE "public"."enum__pages_v_version_hero_hero_soria_eyebrow_font_family";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_servicios_soria_services_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_servicios_soria_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_servicios_soria_subtitle_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_servicios_soria_card_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_servicios_soria_cta_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_servicios_soria_services_cta_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_servicios_soria_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_servicios_soria_subtitle_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_servicios_soria_card_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_servicios_soria_cta_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  ALTER TYPE "public"."enum_pages_blocks_layout_soria2_font_family" ADD VALUE IF NOT EXISTS '"Instrument Serif", serif' BEFORE 'Arial, sans-serif';
  ALTER TYPE "public"."enum__pages_v_blocks_layout_soria2_font_family" ADD VALUE IF NOT EXISTS '"Instrument Serif", serif' BEFORE 'Arial, sans-serif';
  CREATE TABLE "pages_blocks_servicios_soria_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" jsonb,
  	"description" jsonb,
  	"cta_type" "enum_pages_blocks_servicios_soria_services_cta_type" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar
  );
  
  CREATE TABLE "pages_blocks_servicios_soria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" jsonb,
  	"subtitle" jsonb,
  	"autoplay" boolean DEFAULT true,
  	"autoplay_ms" numeric DEFAULT 4500,
  	"background_color" varchar,
  	"title_color" varchar,
  	"title_font_family" "enum_pages_blocks_servicios_soria_title_font_family" DEFAULT 'default',
  	"subtitle_color" varchar,
  	"subtitle_font_family" "enum_pages_blocks_servicios_soria_subtitle_font_family" DEFAULT 'default',
  	"card_text_color" varchar,
  	"card_font_family" "enum_pages_blocks_servicios_soria_card_font_family" DEFAULT 'default',
  	"cta_background_color" varchar,
  	"cta_text_color" varchar,
  	"cta_font_family" "enum_pages_blocks_servicios_soria_cta_font_family" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_servicios_soria_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"label" jsonb,
  	"description" jsonb,
  	"cta_type" "enum__pages_v_blocks_servicios_soria_services_cta_type" DEFAULT 'reference',
  	"cta_new_tab" boolean,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_servicios_soria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"eyebrow" varchar,
  	"title" jsonb,
  	"subtitle" jsonb,
  	"autoplay" boolean DEFAULT true,
  	"autoplay_ms" numeric DEFAULT 4500,
  	"background_color" varchar,
  	"title_color" varchar,
  	"title_font_family" "enum__pages_v_blocks_servicios_soria_title_font_family" DEFAULT 'default',
  	"subtitle_color" varchar,
  	"subtitle_font_family" "enum__pages_v_blocks_servicios_soria_subtitle_font_family" DEFAULT 'default',
  	"card_text_color" varchar,
  	"card_font_family" "enum__pages_v_blocks_servicios_soria_card_font_family" DEFAULT 'default',
  	"cta_background_color" varchar,
  	"cta_text_color" varchar,
  	"cta_font_family" "enum__pages_v_blocks_servicios_soria_cta_font_family" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_servicios_soria_services" ADD CONSTRAINT "pages_blocks_servicios_soria_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_servicios_soria_services" ADD CONSTRAINT "pages_blocks_servicios_soria_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_servicios_soria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_servicios_soria" ADD CONSTRAINT "pages_blocks_servicios_soria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_servicios_soria_services" ADD CONSTRAINT "_pages_v_blocks_servicios_soria_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_servicios_soria_services" ADD CONSTRAINT "_pages_v_blocks_servicios_soria_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_servicios_soria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_servicios_soria" ADD CONSTRAINT "_pages_v_blocks_servicios_soria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_servicios_soria_services_order_idx" ON "pages_blocks_servicios_soria_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_servicios_soria_services_parent_id_idx" ON "pages_blocks_servicios_soria_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_servicios_soria_services_image_idx" ON "pages_blocks_servicios_soria_services" USING btree ("image_id");
  CREATE INDEX "pages_blocks_servicios_soria_order_idx" ON "pages_blocks_servicios_soria" USING btree ("_order");
  CREATE INDEX "pages_blocks_servicios_soria_parent_id_idx" ON "pages_blocks_servicios_soria" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_servicios_soria_path_idx" ON "pages_blocks_servicios_soria" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_servicios_soria_services_order_idx" ON "_pages_v_blocks_servicios_soria_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_servicios_soria_services_parent_id_idx" ON "_pages_v_blocks_servicios_soria_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_servicios_soria_services_image_idx" ON "_pages_v_blocks_servicios_soria_services" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_servicios_soria_order_idx" ON "_pages_v_blocks_servicios_soria" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_servicios_soria_parent_id_idx" ON "_pages_v_blocks_servicios_soria" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_servicios_soria_path_idx" ON "_pages_v_blocks_servicios_soria" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_servicios_soria_services" CASCADE;
  DROP TABLE "pages_blocks_servicios_soria" CASCADE;
  DROP TABLE "_pages_v_blocks_servicios_soria_services" CASCADE;
  DROP TABLE "_pages_v_blocks_servicios_soria" CASCADE;
  ALTER TABLE "pages_blocks_layout_soria2" ALTER COLUMN "font_family" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_layout_soria2" ALTER COLUMN "font_family" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_layout_soria2_font_family";
  CREATE TYPE "public"."enum_pages_blocks_layout_soria2_font_family" AS ENUM('default', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  ALTER TABLE "pages_blocks_layout_soria2" ALTER COLUMN "font_family" SET DEFAULT 'default'::"public"."enum_pages_blocks_layout_soria2_font_family";
  ALTER TABLE "pages_blocks_layout_soria2" ALTER COLUMN "font_family" SET DATA TYPE "public"."enum_pages_blocks_layout_soria2_font_family" USING "font_family"::"public"."enum_pages_blocks_layout_soria2_font_family";
  ALTER TABLE "_pages_v_blocks_layout_soria2" ALTER COLUMN "font_family" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_layout_soria2" ALTER COLUMN "font_family" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_layout_soria2_font_family";
  CREATE TYPE "public"."enum__pages_v_blocks_layout_soria2_font_family" AS ENUM('default', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  ALTER TABLE "_pages_v_blocks_layout_soria2" ALTER COLUMN "font_family" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_layout_soria2_font_family";
  ALTER TABLE "_pages_v_blocks_layout_soria2" ALTER COLUMN "font_family" SET DATA TYPE "public"."enum__pages_v_blocks_layout_soria2_font_family" USING "font_family"::"public"."enum__pages_v_blocks_layout_soria2_font_family";
  DROP TYPE "public"."enum_pages_blocks_servicios_soria_services_cta_type";
  DROP TYPE "public"."enum_pages_blocks_servicios_soria_title_font_family";
  DROP TYPE "public"."enum_pages_blocks_servicios_soria_subtitle_font_family";
  DROP TYPE "public"."enum_pages_blocks_servicios_soria_card_font_family";
  DROP TYPE "public"."enum_pages_blocks_servicios_soria_cta_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_servicios_soria_services_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_servicios_soria_title_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_servicios_soria_subtitle_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_servicios_soria_card_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_servicios_soria_cta_font_family";`)
}

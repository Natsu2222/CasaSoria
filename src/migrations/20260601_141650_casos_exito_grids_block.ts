import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_casos_exito_grids_header_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_casos_exito_grids_card_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_grids_header_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_grids_card_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TABLE "pages_blocks_casos_exito_grids_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"company" varchar,
  	"description" jsonb,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_casos_exito_grids" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"enable_animation" boolean DEFAULT true,
  	"animation_distance" numeric DEFAULT 60,
  	"animation_duration" numeric DEFAULT 800,
  	"header_font" "enum_pages_blocks_casos_exito_grids_header_font" DEFAULT 'Montserrat, sans-serif',
  	"card_font" "enum_pages_blocks_casos_exito_grids_card_font" DEFAULT 'Montserrat, sans-serif',
  	"section_background" varchar DEFAULT '#ffffff',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"company_color" varchar DEFAULT '#1e1e1c',
  	"description_color" varchar DEFAULT '#1e1e1c',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_casos_exito_grids_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"company" varchar,
  	"description" jsonb,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_casos_exito_grids" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"enable_animation" boolean DEFAULT true,
  	"animation_distance" numeric DEFAULT 60,
  	"animation_duration" numeric DEFAULT 800,
  	"header_font" "enum__pages_v_blocks_casos_exito_grids_header_font" DEFAULT 'Montserrat, sans-serif',
  	"card_font" "enum__pages_v_blocks_casos_exito_grids_card_font" DEFAULT 'Montserrat, sans-serif',
  	"section_background" varchar DEFAULT '#ffffff',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"company_color" varchar DEFAULT '#1e1e1c',
  	"description_color" varchar DEFAULT '#1e1e1c',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_casos_exito_grids_cases" ADD CONSTRAINT "pages_blocks_casos_exito_grids_cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_casos_exito_grids_cases" ADD CONSTRAINT "pages_blocks_casos_exito_grids_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_casos_exito_grids"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_casos_exito_grids" ADD CONSTRAINT "pages_blocks_casos_exito_grids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_casos_exito_grids_cases" ADD CONSTRAINT "_pages_v_blocks_casos_exito_grids_cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_casos_exito_grids_cases" ADD CONSTRAINT "_pages_v_blocks_casos_exito_grids_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_casos_exito_grids"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_casos_exito_grids" ADD CONSTRAINT "_pages_v_blocks_casos_exito_grids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_casos_exito_grids_cases_order_idx" ON "pages_blocks_casos_exito_grids_cases" USING btree ("_order");
  CREATE INDEX "pages_blocks_casos_exito_grids_cases_parent_id_idx" ON "pages_blocks_casos_exito_grids_cases" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_casos_exito_grids_cases_image_idx" ON "pages_blocks_casos_exito_grids_cases" USING btree ("image_id");
  CREATE INDEX "pages_blocks_casos_exito_grids_order_idx" ON "pages_blocks_casos_exito_grids" USING btree ("_order");
  CREATE INDEX "pages_blocks_casos_exito_grids_parent_id_idx" ON "pages_blocks_casos_exito_grids" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_casos_exito_grids_path_idx" ON "pages_blocks_casos_exito_grids" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_casos_exito_grids_cases_order_idx" ON "_pages_v_blocks_casos_exito_grids_cases" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_casos_exito_grids_cases_parent_id_idx" ON "_pages_v_blocks_casos_exito_grids_cases" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_casos_exito_grids_cases_image_idx" ON "_pages_v_blocks_casos_exito_grids_cases" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_casos_exito_grids_order_idx" ON "_pages_v_blocks_casos_exito_grids" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_casos_exito_grids_parent_id_idx" ON "_pages_v_blocks_casos_exito_grids" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_casos_exito_grids_path_idx" ON "_pages_v_blocks_casos_exito_grids" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_casos_exito_grids_cases" CASCADE;
  DROP TABLE "pages_blocks_casos_exito_grids" CASCADE;
  DROP TABLE "_pages_v_blocks_casos_exito_grids_cases" CASCADE;
  DROP TABLE "_pages_v_blocks_casos_exito_grids" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_casos_exito_grids_header_font";
  DROP TYPE "public"."enum_pages_blocks_casos_exito_grids_card_font";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_grids_header_font";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_grids_card_font";`)
}

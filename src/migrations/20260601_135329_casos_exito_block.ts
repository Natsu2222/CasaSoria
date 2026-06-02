import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_casos_exito_effect" AS ENUM('fade', 'slide');
  CREATE TYPE "public"."enum_pages_blocks_casos_exito_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_casos_exito_image_split" AS ENUM('50/50', '60/40', '40/60');
  CREATE TYPE "public"."enum_pages_blocks_casos_exito_header_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_casos_exito_slide_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_effect" AS ENUM('fade', 'slide');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_image_split" AS ENUM('50/50', '60/40', '40/60');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_header_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_casos_exito_slide_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TABLE "pages_blocks_casos_exito_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"company" jsonb,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_casos_exito" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"effect" "enum_pages_blocks_casos_exito_effect" DEFAULT 'fade',
  	"autoplay" boolean DEFAULT true,
  	"autoplay_delay" numeric DEFAULT 4500,
  	"loop" boolean DEFAULT true,
  	"speed" numeric DEFAULT 800,
  	"pause_on_hover" boolean DEFAULT true,
  	"image_position" "enum_pages_blocks_casos_exito_image_position" DEFAULT 'left',
  	"image_split" "enum_pages_blocks_casos_exito_image_split" DEFAULT '50/50',
  	"slide_min_height" numeric DEFAULT 420,
  	"section_background" varchar DEFAULT '#ffffff',
  	"slide_background" varchar DEFAULT '#f3f3f3',
  	"header_font" "enum_pages_blocks_casos_exito_header_font" DEFAULT 'Montserrat, sans-serif',
  	"slide_font" "enum_pages_blocks_casos_exito_slide_font" DEFAULT 'Montserrat, sans-serif',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"company_color" varchar DEFAULT '#1e1e1c',
  	"description_color" varchar DEFAULT '#1e1e1c',
  	"dots_color" varchar DEFAULT '#FFC950',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_casos_exito_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"company" jsonb,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_casos_exito" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"effect" "enum__pages_v_blocks_casos_exito_effect" DEFAULT 'fade',
  	"autoplay" boolean DEFAULT true,
  	"autoplay_delay" numeric DEFAULT 4500,
  	"loop" boolean DEFAULT true,
  	"speed" numeric DEFAULT 800,
  	"pause_on_hover" boolean DEFAULT true,
  	"image_position" "enum__pages_v_blocks_casos_exito_image_position" DEFAULT 'left',
  	"image_split" "enum__pages_v_blocks_casos_exito_image_split" DEFAULT '50/50',
  	"slide_min_height" numeric DEFAULT 420,
  	"section_background" varchar DEFAULT '#ffffff',
  	"slide_background" varchar DEFAULT '#f3f3f3',
  	"header_font" "enum__pages_v_blocks_casos_exito_header_font" DEFAULT 'Montserrat, sans-serif',
  	"slide_font" "enum__pages_v_blocks_casos_exito_slide_font" DEFAULT 'Montserrat, sans-serif',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"company_color" varchar DEFAULT '#1e1e1c',
  	"description_color" varchar DEFAULT '#1e1e1c',
  	"dots_color" varchar DEFAULT '#FFC950',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_casos_exito_slides" ADD CONSTRAINT "pages_blocks_casos_exito_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_casos_exito_slides" ADD CONSTRAINT "pages_blocks_casos_exito_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_casos_exito"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_casos_exito" ADD CONSTRAINT "pages_blocks_casos_exito_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_casos_exito_slides" ADD CONSTRAINT "_pages_v_blocks_casos_exito_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_casos_exito_slides" ADD CONSTRAINT "_pages_v_blocks_casos_exito_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_casos_exito"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_casos_exito" ADD CONSTRAINT "_pages_v_blocks_casos_exito_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_casos_exito_slides_order_idx" ON "pages_blocks_casos_exito_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_casos_exito_slides_parent_id_idx" ON "pages_blocks_casos_exito_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_casos_exito_slides_image_idx" ON "pages_blocks_casos_exito_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_casos_exito_order_idx" ON "pages_blocks_casos_exito" USING btree ("_order");
  CREATE INDEX "pages_blocks_casos_exito_parent_id_idx" ON "pages_blocks_casos_exito" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_casos_exito_path_idx" ON "pages_blocks_casos_exito" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_casos_exito_slides_order_idx" ON "_pages_v_blocks_casos_exito_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_casos_exito_slides_parent_id_idx" ON "_pages_v_blocks_casos_exito_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_casos_exito_slides_image_idx" ON "_pages_v_blocks_casos_exito_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_casos_exito_order_idx" ON "_pages_v_blocks_casos_exito" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_casos_exito_parent_id_idx" ON "_pages_v_blocks_casos_exito" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_casos_exito_path_idx" ON "_pages_v_blocks_casos_exito" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_casos_exito_slides" CASCADE;
  DROP TABLE "pages_blocks_casos_exito" CASCADE;
  DROP TABLE "_pages_v_blocks_casos_exito_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_casos_exito" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_casos_exito_effect";
  DROP TYPE "public"."enum_pages_blocks_casos_exito_image_position";
  DROP TYPE "public"."enum_pages_blocks_casos_exito_image_split";
  DROP TYPE "public"."enum_pages_blocks_casos_exito_header_font";
  DROP TYPE "public"."enum_pages_blocks_casos_exito_slide_font";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_effect";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_image_split";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_header_font";
  DROP TYPE "public"."enum__pages_v_blocks_casos_exito_slide_font";`)
}

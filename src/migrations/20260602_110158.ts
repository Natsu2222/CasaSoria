import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_parallax_background_position" AS ENUM('center center', 'center top', 'center bottom', 'left center', 'right center');
  CREATE TYPE "public"."enum_pages_blocks_cta_parallax_text_columns" AS ENUM('9', '8', '6');
  CREATE TYPE "public"."enum_pages_blocks_cta_parallax_padding_y" AS ENUM('60', '90', '120', '160');
  CREATE TYPE "public"."enum_pages_blocks_cta_parallax_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_cta_parallax_heading_size" AS ENUM('30', '36', '40', '45', '50');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_parallax_background_position" AS ENUM('center center', 'center top', 'center bottom', 'left center', 'right center');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_parallax_text_columns" AS ENUM('9', '8', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_parallax_padding_y" AS ENUM('60', '90', '120', '160');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_parallax_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_parallax_heading_size" AS ENUM('30', '36', '40', '45', '50');
  CREATE TABLE "pages_blocks_cta_parallax" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" jsonb,
  	"cta_label" varchar DEFAULT 'CUÉNTANOS',
  	"cta_url" varchar DEFAULT '/hablemos/',
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"background_image_id" integer,
  	"background_position" "enum_pages_blocks_cta_parallax_background_position" DEFAULT 'center center',
  	"overlay_color" varchar,
  	"disable_parallax_on_touch" boolean DEFAULT true,
  	"text_columns" "enum_pages_blocks_cta_parallax_text_columns" DEFAULT '9',
  	"padding_y" "enum_pages_blocks_cta_parallax_padding_y" DEFAULT '90',
  	"heading_font" "enum_pages_blocks_cta_parallax_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_size" "enum_pages_blocks_cta_parallax_heading_size" DEFAULT '40',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"button_fill_color" varchar DEFAULT '#f3f3f3',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_parallax" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" jsonb,
  	"cta_label" varchar DEFAULT 'CUÉNTANOS',
  	"cta_url" varchar DEFAULT '/hablemos/',
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"background_image_id" integer,
  	"background_position" "enum__pages_v_blocks_cta_parallax_background_position" DEFAULT 'center center',
  	"overlay_color" varchar,
  	"disable_parallax_on_touch" boolean DEFAULT true,
  	"text_columns" "enum__pages_v_blocks_cta_parallax_text_columns" DEFAULT '9',
  	"padding_y" "enum__pages_v_blocks_cta_parallax_padding_y" DEFAULT '90',
  	"heading_font" "enum__pages_v_blocks_cta_parallax_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_size" "enum__pages_v_blocks_cta_parallax_heading_size" DEFAULT '40',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"button_fill_color" varchar DEFAULT '#f3f3f3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_cta_parallax" ADD CONSTRAINT "pages_blocks_cta_parallax_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_parallax" ADD CONSTRAINT "pages_blocks_cta_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_parallax" ADD CONSTRAINT "_pages_v_blocks_cta_parallax_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_parallax" ADD CONSTRAINT "_pages_v_blocks_cta_parallax_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_parallax_order_idx" ON "pages_blocks_cta_parallax" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parallax_parent_id_idx" ON "pages_blocks_cta_parallax" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_parallax_path_idx" ON "pages_blocks_cta_parallax" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_parallax_background_image_idx" ON "pages_blocks_cta_parallax" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_cta_parallax_order_idx" ON "_pages_v_blocks_cta_parallax" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parallax_parent_id_idx" ON "_pages_v_blocks_cta_parallax" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_parallax_path_idx" ON "_pages_v_blocks_cta_parallax" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_parallax_background_image_idx" ON "_pages_v_blocks_cta_parallax" USING btree ("background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_cta_parallax" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_parallax" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_cta_parallax_background_position";
  DROP TYPE "public"."enum_pages_blocks_cta_parallax_text_columns";
  DROP TYPE "public"."enum_pages_blocks_cta_parallax_padding_y";
  DROP TYPE "public"."enum_pages_blocks_cta_parallax_heading_font";
  DROP TYPE "public"."enum_pages_blocks_cta_parallax_heading_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_parallax_background_position";
  DROP TYPE "public"."enum__pages_v_blocks_cta_parallax_text_columns";
  DROP TYPE "public"."enum__pages_v_blocks_cta_parallax_padding_y";
  DROP TYPE "public"."enum__pages_v_blocks_cta_parallax_heading_font";
  DROP TYPE "public"."enum__pages_v_blocks_cta_parallax_heading_size";`)
}

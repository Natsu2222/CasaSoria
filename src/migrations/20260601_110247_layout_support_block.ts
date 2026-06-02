import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_layout_support_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_layout_support_eyebrow_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_layout_support_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_layout_support_body_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_layout_support_background_type" AS ENUM('image', 'color');
  CREATE TYPE "public"."enum_pages_blocks_layout_support_background_position" AS ENUM('center center', 'right center', 'left center', 'center top', 'center bottom');
  CREATE TYPE "public"."enum_pages_blocks_layout_support_padding_y" AS ENUM('80', '120', '160', '200');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_eyebrow_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_body_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_background_type" AS ENUM('image', 'color');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_background_position" AS ENUM('center center', 'right center', 'left center', 'center top', 'center bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_support_padding_y" AS ENUM('80', '120', '160', '200');
  CREATE TABLE "pages_blocks_layout_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_position" "enum_pages_blocks_layout_support_image_position" DEFAULT 'left',
  	"image_id" integer,
  	"image_alt" varchar,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"body" jsonb,
  	"cta_label" varchar DEFAULT '¿INTERESADO?',
  	"cta_url" varchar,
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"eyebrow_font" "enum_pages_blocks_layout_support_eyebrow_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_font" "enum_pages_blocks_layout_support_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"body_font" "enum_pages_blocks_layout_support_body_font" DEFAULT 'Montserrat, sans-serif',
  	"background_type" "enum_pages_blocks_layout_support_background_type" DEFAULT 'image',
  	"background_image_id" integer,
  	"background_position" "enum_pages_blocks_layout_support_background_position" DEFAULT 'right center',
  	"background_color" varchar DEFAULT '#ffffff',
  	"overlay_color" varchar,
  	"padding_y" "enum_pages_blocks_layout_support_padding_y" DEFAULT '160',
  	"eyebrow_color" varchar DEFAULT '#1e1e1c',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"body_color" varchar DEFAULT '#f3f3f3',
  	"image_pulse_color" varchar DEFAULT '#FFC950',
  	"enable_fade_in" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_layout_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_position" "enum__pages_v_blocks_layout_support_image_position" DEFAULT 'left',
  	"image_id" integer,
  	"image_alt" varchar,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"body" jsonb,
  	"cta_label" varchar DEFAULT '¿INTERESADO?',
  	"cta_url" varchar,
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"eyebrow_font" "enum__pages_v_blocks_layout_support_eyebrow_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_font" "enum__pages_v_blocks_layout_support_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"body_font" "enum__pages_v_blocks_layout_support_body_font" DEFAULT 'Montserrat, sans-serif',
  	"background_type" "enum__pages_v_blocks_layout_support_background_type" DEFAULT 'image',
  	"background_image_id" integer,
  	"background_position" "enum__pages_v_blocks_layout_support_background_position" DEFAULT 'right center',
  	"background_color" varchar DEFAULT '#ffffff',
  	"overlay_color" varchar,
  	"padding_y" "enum__pages_v_blocks_layout_support_padding_y" DEFAULT '160',
  	"eyebrow_color" varchar DEFAULT '#1e1e1c',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"body_color" varchar DEFAULT '#f3f3f3',
  	"image_pulse_color" varchar DEFAULT '#FFC950',
  	"enable_fade_in" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_layout_support" ADD CONSTRAINT "pages_blocks_layout_support_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_support" ADD CONSTRAINT "pages_blocks_layout_support_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_support" ADD CONSTRAINT "pages_blocks_layout_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_support" ADD CONSTRAINT "_pages_v_blocks_layout_support_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_support" ADD CONSTRAINT "_pages_v_blocks_layout_support_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_support" ADD CONSTRAINT "_pages_v_blocks_layout_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_layout_support_order_idx" ON "pages_blocks_layout_support" USING btree ("_order");
  CREATE INDEX "pages_blocks_layout_support_parent_id_idx" ON "pages_blocks_layout_support" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_layout_support_path_idx" ON "pages_blocks_layout_support" USING btree ("_path");
  CREATE INDEX "pages_blocks_layout_support_image_idx" ON "pages_blocks_layout_support" USING btree ("image_id");
  CREATE INDEX "pages_blocks_layout_support_background_image_idx" ON "pages_blocks_layout_support" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_layout_support_order_idx" ON "_pages_v_blocks_layout_support" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_layout_support_parent_id_idx" ON "_pages_v_blocks_layout_support" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_layout_support_path_idx" ON "_pages_v_blocks_layout_support" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_layout_support_image_idx" ON "_pages_v_blocks_layout_support" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_layout_support_background_image_idx" ON "_pages_v_blocks_layout_support" USING btree ("background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_layout_support" CASCADE;
  DROP TABLE "_pages_v_blocks_layout_support" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_layout_support_image_position";
  DROP TYPE "public"."enum_pages_blocks_layout_support_eyebrow_font";
  DROP TYPE "public"."enum_pages_blocks_layout_support_heading_font";
  DROP TYPE "public"."enum_pages_blocks_layout_support_body_font";
  DROP TYPE "public"."enum_pages_blocks_layout_support_background_type";
  DROP TYPE "public"."enum_pages_blocks_layout_support_background_position";
  DROP TYPE "public"."enum_pages_blocks_layout_support_padding_y";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_eyebrow_font";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_heading_font";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_body_font";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_background_type";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_background_position";
  DROP TYPE "public"."enum__pages_v_blocks_layout_support_padding_y";`)
}

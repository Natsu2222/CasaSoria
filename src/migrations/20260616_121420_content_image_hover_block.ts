import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_image_hover_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_blocks_content_image_hover_hover_scale" AS ENUM('1.05', '1.1', '1.15', '1.2', '1.25', '1.3');
  CREATE TYPE "public"."enum_pages_blocks_content_image_hover_hover_duration" AS ENUM('300', '600', '900', '1200');
  CREATE TYPE "public"."enum_pages_blocks_content_image_hover_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_content_image_hover_subheading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_content_image_hover_description_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_content_image_hover_padding_y" AS ENUM('80', '100', '120', '160', '200');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_hover_scale" AS ENUM('1.05', '1.1', '1.15', '1.2', '1.25', '1.3');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_hover_duration" AS ENUM('300', '600', '900', '1200');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_subheading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_description_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_content_image_hover_padding_y" AS ENUM('80', '100', '120', '160', '200');
  CREATE TABLE "pages_blocks_content_image_hover" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_position" "enum_pages_blocks_content_image_hover_image_position" DEFAULT 'right',
  	"base_image_id" integer,
  	"base_image_alt" varchar,
  	"top_image_id" integer,
  	"top_image_alt" varchar,
  	"hover_scale" "enum_pages_blocks_content_image_hover_hover_scale" DEFAULT '1.1',
  	"hover_duration" "enum_pages_blocks_content_image_hover_hover_duration" DEFAULT '600',
  	"heading" jsonb,
  	"subheading" jsonb,
  	"description" jsonb,
  	"heading_font" "enum_pages_blocks_content_image_hover_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"subheading_font" "enum_pages_blocks_content_image_hover_subheading_font" DEFAULT 'Montserrat, sans-serif',
  	"description_font" "enum_pages_blocks_content_image_hover_description_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"subheading_color" varchar DEFAULT '#1e1e1c',
  	"description_color" varchar DEFAULT '#1e1e1c',
  	"background_color" varchar DEFAULT '#f3f3f3',
  	"padding_y" "enum_pages_blocks_content_image_hover_padding_y" DEFAULT '120',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_image_hover" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_position" "enum__pages_v_blocks_content_image_hover_image_position" DEFAULT 'right',
  	"base_image_id" integer,
  	"base_image_alt" varchar,
  	"top_image_id" integer,
  	"top_image_alt" varchar,
  	"hover_scale" "enum__pages_v_blocks_content_image_hover_hover_scale" DEFAULT '1.1',
  	"hover_duration" "enum__pages_v_blocks_content_image_hover_hover_duration" DEFAULT '600',
  	"heading" jsonb,
  	"subheading" jsonb,
  	"description" jsonb,
  	"heading_font" "enum__pages_v_blocks_content_image_hover_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"subheading_font" "enum__pages_v_blocks_content_image_hover_subheading_font" DEFAULT 'Montserrat, sans-serif',
  	"description_font" "enum__pages_v_blocks_content_image_hover_description_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"subheading_color" varchar DEFAULT '#1e1e1c',
  	"description_color" varchar DEFAULT '#1e1e1c',
  	"background_color" varchar DEFAULT '#f3f3f3',
  	"padding_y" "enum__pages_v_blocks_content_image_hover_padding_y" DEFAULT '120',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_content_image_hover" ADD CONSTRAINT "pages_blocks_content_image_hover_base_image_id_media_id_fk" FOREIGN KEY ("base_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_image_hover" ADD CONSTRAINT "pages_blocks_content_image_hover_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_image_hover" ADD CONSTRAINT "pages_blocks_content_image_hover_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_image_hover" ADD CONSTRAINT "_pages_v_blocks_content_image_hover_base_image_id_media_id_fk" FOREIGN KEY ("base_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_image_hover" ADD CONSTRAINT "_pages_v_blocks_content_image_hover_top_image_id_media_id_fk" FOREIGN KEY ("top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_image_hover" ADD CONSTRAINT "_pages_v_blocks_content_image_hover_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_image_hover_order_idx" ON "pages_blocks_content_image_hover" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_image_hover_parent_id_idx" ON "pages_blocks_content_image_hover" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_image_hover_path_idx" ON "pages_blocks_content_image_hover" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_image_hover_base_image_idx" ON "pages_blocks_content_image_hover" USING btree ("base_image_id");
  CREATE INDEX "pages_blocks_content_image_hover_top_image_idx" ON "pages_blocks_content_image_hover" USING btree ("top_image_id");
  CREATE INDEX "_pages_v_blocks_content_image_hover_order_idx" ON "_pages_v_blocks_content_image_hover" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_image_hover_parent_id_idx" ON "_pages_v_blocks_content_image_hover" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_image_hover_path_idx" ON "_pages_v_blocks_content_image_hover" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_image_hover_base_image_idx" ON "_pages_v_blocks_content_image_hover" USING btree ("base_image_id");
  CREATE INDEX "_pages_v_blocks_content_image_hover_top_image_idx" ON "_pages_v_blocks_content_image_hover" USING btree ("top_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_content_image_hover" CASCADE;
  DROP TABLE "_pages_v_blocks_content_image_hover" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_image_position";
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_hover_scale";
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_hover_duration";
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_heading_font";
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_subheading_font";
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_description_font";
  DROP TYPE "public"."enum_pages_blocks_content_image_hover_padding_y";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_hover_scale";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_hover_duration";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_heading_font";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_subheading_font";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_description_font";
  DROP TYPE "public"."enum__pages_v_blocks_content_image_hover_padding_y";`)
}

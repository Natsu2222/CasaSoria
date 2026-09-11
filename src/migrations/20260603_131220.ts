import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_flex_content_cta_style" AS ENUM('btnNegro', 'animatedLine');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_image_position" AS ENUM('right', 'left', 'top', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_image_width_percent" AS ENUM('25', '33', '40', '50', '60', '66', '75');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_image_vertical_align" AS ENUM('start', 'center', 'end');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_image_object_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_background_type" AS ENUM('color', 'image');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_background_position" AS ENUM('center center', 'center top', 'center bottom', 'left center', 'right center');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_padding_top" AS ENUM('0', '40', '60', '80', '100', '120');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_padding_bottom" AS ENUM('0', '40', '60', '80', '100', '120');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_vertical_align" AS ENUM('start', 'center', 'end');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_column_gap" AS ENUM('16', '32', '48', '64', '80');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_body_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_heading_size" AS ENUM('24', '28', '32', '36', '40', '48');
  CREATE TYPE "public"."enum_pages_blocks_flex_content_subheading_size" AS ENUM('16', '18', '20', '22', '24', '28');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_cta_style" AS ENUM('btnNegro', 'animatedLine');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_image_position" AS ENUM('right', 'left', 'top', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_image_width_percent" AS ENUM('25', '33', '40', '50', '60', '66', '75');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_image_vertical_align" AS ENUM('start', 'center', 'end');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_image_object_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_background_type" AS ENUM('color', 'image');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_background_position" AS ENUM('center center', 'center top', 'center bottom', 'left center', 'right center');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_padding_top" AS ENUM('0', '40', '60', '80', '100', '120');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_padding_bottom" AS ENUM('0', '40', '60', '80', '100', '120');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_text_align" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_vertical_align" AS ENUM('start', 'center', 'end');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_column_gap" AS ENUM('16', '32', '48', '64', '80');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_heading_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_body_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_heading_size" AS ENUM('24', '28', '32', '36', '40', '48');
  CREATE TYPE "public"."enum__pages_v_blocks_flex_content_subheading_size" AS ENUM('16', '18', '20', '22', '24', '28');
  CREATE TABLE "pages_blocks_flex_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"subheading" jsonb,
  	"body" jsonb,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"cta_style" "enum_pages_blocks_flex_content_cta_style" DEFAULT 'btnNegro',
  	"button_fill_color" varchar DEFAULT '#1e1e1c',
  	"button_text_color" varchar DEFAULT '#ffffff',
  	"button_border_color" varchar DEFAULT '#1e1e1c',
  	"image_id" integer,
  	"image_alt" varchar,
  	"image_position" "enum_pages_blocks_flex_content_image_position" DEFAULT 'right',
  	"image_width_percent" "enum_pages_blocks_flex_content_image_width_percent" DEFAULT '50',
  	"image_vertical_align" "enum_pages_blocks_flex_content_image_vertical_align" DEFAULT 'center',
  	"image_object_fit" "enum_pages_blocks_flex_content_image_object_fit" DEFAULT 'cover',
  	"image_rounded" boolean DEFAULT false,
  	"second_image_id" integer,
  	"second_image_alt" varchar,
  	"background_type" "enum_pages_blocks_flex_content_background_type" DEFAULT 'color',
  	"background_color" varchar DEFAULT '#ffffff',
  	"background_image_id" integer,
  	"background_position" "enum_pages_blocks_flex_content_background_position" DEFAULT 'center center',
  	"overlay_color" varchar,
  	"padding_top" "enum_pages_blocks_flex_content_padding_top" DEFAULT '80',
  	"padding_bottom" "enum_pages_blocks_flex_content_padding_bottom" DEFAULT '80',
  	"text_align" "enum_pages_blocks_flex_content_text_align" DEFAULT 'left',
  	"vertical_align" "enum_pages_blocks_flex_content_vertical_align" DEFAULT 'center',
  	"column_gap" "enum_pages_blocks_flex_content_column_gap" DEFAULT '48',
  	"heading_font" "enum_pages_blocks_flex_content_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"body_font" "enum_pages_blocks_flex_content_body_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_size" "enum_pages_blocks_flex_content_heading_size" DEFAULT '36',
  	"subheading_size" "enum_pages_blocks_flex_content_subheading_size" DEFAULT '22',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"subheading_color" varchar DEFAULT '#1e1e1c',
  	"body_color" varchar DEFAULT '#1e1e1c',
  	"eyebrow_line_color" varchar DEFAULT '#FFC950',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_flex_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"subheading" jsonb,
  	"body" jsonb,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"cta_style" "enum__pages_v_blocks_flex_content_cta_style" DEFAULT 'btnNegro',
  	"button_fill_color" varchar DEFAULT '#1e1e1c',
  	"button_text_color" varchar DEFAULT '#ffffff',
  	"button_border_color" varchar DEFAULT '#1e1e1c',
  	"image_id" integer,
  	"image_alt" varchar,
  	"image_position" "enum__pages_v_blocks_flex_content_image_position" DEFAULT 'right',
  	"image_width_percent" "enum__pages_v_blocks_flex_content_image_width_percent" DEFAULT '50',
  	"image_vertical_align" "enum__pages_v_blocks_flex_content_image_vertical_align" DEFAULT 'center',
  	"image_object_fit" "enum__pages_v_blocks_flex_content_image_object_fit" DEFAULT 'cover',
  	"image_rounded" boolean DEFAULT false,
  	"second_image_id" integer,
  	"second_image_alt" varchar,
  	"background_type" "enum__pages_v_blocks_flex_content_background_type" DEFAULT 'color',
  	"background_color" varchar DEFAULT '#ffffff',
  	"background_image_id" integer,
  	"background_position" "enum__pages_v_blocks_flex_content_background_position" DEFAULT 'center center',
  	"overlay_color" varchar,
  	"padding_top" "enum__pages_v_blocks_flex_content_padding_top" DEFAULT '80',
  	"padding_bottom" "enum__pages_v_blocks_flex_content_padding_bottom" DEFAULT '80',
  	"text_align" "enum__pages_v_blocks_flex_content_text_align" DEFAULT 'left',
  	"vertical_align" "enum__pages_v_blocks_flex_content_vertical_align" DEFAULT 'center',
  	"column_gap" "enum__pages_v_blocks_flex_content_column_gap" DEFAULT '48',
  	"heading_font" "enum__pages_v_blocks_flex_content_heading_font" DEFAULT 'Montserrat, sans-serif',
  	"body_font" "enum__pages_v_blocks_flex_content_body_font" DEFAULT 'Montserrat, sans-serif',
  	"heading_size" "enum__pages_v_blocks_flex_content_heading_size" DEFAULT '36',
  	"subheading_size" "enum__pages_v_blocks_flex_content_subheading_size" DEFAULT '22',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"subheading_color" varchar DEFAULT '#1e1e1c',
  	"body_color" varchar DEFAULT '#1e1e1c',
  	"eyebrow_line_color" varchar DEFAULT '#FFC950',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_flex_content" ADD CONSTRAINT "pages_blocks_flex_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_flex_content" ADD CONSTRAINT "pages_blocks_flex_content_second_image_id_media_id_fk" FOREIGN KEY ("second_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_flex_content" ADD CONSTRAINT "pages_blocks_flex_content_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_flex_content" ADD CONSTRAINT "pages_blocks_flex_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flex_content" ADD CONSTRAINT "_pages_v_blocks_flex_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flex_content" ADD CONSTRAINT "_pages_v_blocks_flex_content_second_image_id_media_id_fk" FOREIGN KEY ("second_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flex_content" ADD CONSTRAINT "_pages_v_blocks_flex_content_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flex_content" ADD CONSTRAINT "_pages_v_blocks_flex_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_flex_content_order_idx" ON "pages_blocks_flex_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_flex_content_parent_id_idx" ON "pages_blocks_flex_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_flex_content_path_idx" ON "pages_blocks_flex_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_flex_content_image_idx" ON "pages_blocks_flex_content" USING btree ("image_id");
  CREATE INDEX "pages_blocks_flex_content_second_image_idx" ON "pages_blocks_flex_content" USING btree ("second_image_id");
  CREATE INDEX "pages_blocks_flex_content_background_image_idx" ON "pages_blocks_flex_content" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_flex_content_order_idx" ON "_pages_v_blocks_flex_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_flex_content_parent_id_idx" ON "_pages_v_blocks_flex_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_flex_content_path_idx" ON "_pages_v_blocks_flex_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_flex_content_image_idx" ON "_pages_v_blocks_flex_content" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_flex_content_second_image_idx" ON "_pages_v_blocks_flex_content" USING btree ("second_image_id");
  CREATE INDEX "_pages_v_blocks_flex_content_background_image_idx" ON "_pages_v_blocks_flex_content" USING btree ("background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_flex_content" CASCADE;
  DROP TABLE "_pages_v_blocks_flex_content" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_flex_content_cta_style";
  DROP TYPE "public"."enum_pages_blocks_flex_content_image_position";
  DROP TYPE "public"."enum_pages_blocks_flex_content_image_width_percent";
  DROP TYPE "public"."enum_pages_blocks_flex_content_image_vertical_align";
  DROP TYPE "public"."enum_pages_blocks_flex_content_image_object_fit";
  DROP TYPE "public"."enum_pages_blocks_flex_content_background_type";
  DROP TYPE "public"."enum_pages_blocks_flex_content_background_position";
  DROP TYPE "public"."enum_pages_blocks_flex_content_padding_top";
  DROP TYPE "public"."enum_pages_blocks_flex_content_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_flex_content_text_align";
  DROP TYPE "public"."enum_pages_blocks_flex_content_vertical_align";
  DROP TYPE "public"."enum_pages_blocks_flex_content_column_gap";
  DROP TYPE "public"."enum_pages_blocks_flex_content_heading_font";
  DROP TYPE "public"."enum_pages_blocks_flex_content_body_font";
  DROP TYPE "public"."enum_pages_blocks_flex_content_heading_size";
  DROP TYPE "public"."enum_pages_blocks_flex_content_subheading_size";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_image_width_percent";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_image_vertical_align";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_image_object_fit";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_background_type";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_background_position";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_vertical_align";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_column_gap";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_heading_font";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_body_font";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_heading_size";
  DROP TYPE "public"."enum__pages_v_blocks_flex_content_subheading_size";`)
}

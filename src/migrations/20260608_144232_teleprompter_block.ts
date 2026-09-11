import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_teleprompter_separator_type" AS ENUM('none', 'dot', 'pipe', 'diamond', 'dash', 'arrow', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_height" AS ENUM('40', '60', '80', '100', '120', '160');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_item_gap" AS ENUM('16', '24', '32', '48', '64', '80');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_icon_size" AS ENUM('24', '32', '40', '48', '56', '64', '72', '80');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_font_size" AS ENUM('12', '14', '16', '18', '20', '24', '28', '32');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_font_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_text_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_letter_spacing" AS ENUM('0', '1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_separator_type" AS ENUM('none', 'dot', 'pipe', 'diamond', 'dash', 'arrow', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_direction" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_height" AS ENUM('40', '60', '80', '100', '120', '160');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_item_gap" AS ENUM('16', '24', '32', '48', '64', '80');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" AS ENUM('24', '32', '40', '48', '56', '64', '72', '80');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_font_size" AS ENUM('12', '14', '16', '18', '20', '24', '28', '32');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_font_weight" AS ENUM('400', '500', '600', '700', '800');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_text_transform" AS ENUM('none', 'uppercase', 'lowercase', 'capitalize');
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_letter_spacing" AS ENUM('0', '1', '2', '3');
  CREATE TABLE "pages_blocks_teleprompter_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon_id" integer,
  	"icon_alt" varchar
  );
  
  CREATE TABLE "pages_blocks_teleprompter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"separator_type" "enum_pages_blocks_teleprompter_separator_type" DEFAULT 'none',
  	"separator_custom" varchar,
  	"separator_color" varchar DEFAULT '#FFC950',
  	"direction" "enum_pages_blocks_teleprompter_direction" DEFAULT 'left',
  	"speed" numeric DEFAULT 30,
  	"pause_on_hover" boolean DEFAULT true,
  	"height" "enum_pages_blocks_teleprompter_height" DEFAULT '80',
  	"item_gap" "enum_pages_blocks_teleprompter_item_gap" DEFAULT '48',
  	"icon_size" "enum_pages_blocks_teleprompter_icon_size" DEFAULT '48',
  	"font_size" "enum_pages_blocks_teleprompter_font_size" DEFAULT '16',
  	"font_weight" "enum_pages_blocks_teleprompter_font_weight" DEFAULT '500',
  	"font" "enum_pages_blocks_teleprompter_font" DEFAULT 'Montserrat, sans-serif',
  	"text_transform" "enum_pages_blocks_teleprompter_text_transform" DEFAULT 'none',
  	"letter_spacing" "enum_pages_blocks_teleprompter_letter_spacing" DEFAULT '0',
  	"background_color" varchar DEFAULT '#1e1e1c',
  	"text_color" varchar DEFAULT '#ffffff',
  	"icon_tint" varchar,
  	"border_top" varchar,
  	"border_bottom" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_teleprompter_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon_id" integer,
  	"icon_alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_teleprompter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"separator_type" "enum__pages_v_blocks_teleprompter_separator_type" DEFAULT 'none',
  	"separator_custom" varchar,
  	"separator_color" varchar DEFAULT '#FFC950',
  	"direction" "enum__pages_v_blocks_teleprompter_direction" DEFAULT 'left',
  	"speed" numeric DEFAULT 30,
  	"pause_on_hover" boolean DEFAULT true,
  	"height" "enum__pages_v_blocks_teleprompter_height" DEFAULT '80',
  	"item_gap" "enum__pages_v_blocks_teleprompter_item_gap" DEFAULT '48',
  	"icon_size" "enum__pages_v_blocks_teleprompter_icon_size" DEFAULT '48',
  	"font_size" "enum__pages_v_blocks_teleprompter_font_size" DEFAULT '16',
  	"font_weight" "enum__pages_v_blocks_teleprompter_font_weight" DEFAULT '500',
  	"font" "enum__pages_v_blocks_teleprompter_font" DEFAULT 'Montserrat, sans-serif',
  	"text_transform" "enum__pages_v_blocks_teleprompter_text_transform" DEFAULT 'none',
  	"letter_spacing" "enum__pages_v_blocks_teleprompter_letter_spacing" DEFAULT '0',
  	"background_color" varchar DEFAULT '#1e1e1c',
  	"text_color" varchar DEFAULT '#ffffff',
  	"icon_tint" varchar,
  	"border_top" varchar,
  	"border_bottom" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_teleprompter_items" ADD CONSTRAINT "pages_blocks_teleprompter_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_teleprompter_items" ADD CONSTRAINT "pages_blocks_teleprompter_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_teleprompter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_teleprompter" ADD CONSTRAINT "pages_blocks_teleprompter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_teleprompter_items" ADD CONSTRAINT "_pages_v_blocks_teleprompter_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_teleprompter_items" ADD CONSTRAINT "_pages_v_blocks_teleprompter_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_teleprompter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_teleprompter" ADD CONSTRAINT "_pages_v_blocks_teleprompter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_teleprompter_items_order_idx" ON "pages_blocks_teleprompter_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_teleprompter_items_parent_id_idx" ON "pages_blocks_teleprompter_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_teleprompter_items_icon_idx" ON "pages_blocks_teleprompter_items" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_teleprompter_order_idx" ON "pages_blocks_teleprompter" USING btree ("_order");
  CREATE INDEX "pages_blocks_teleprompter_parent_id_idx" ON "pages_blocks_teleprompter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_teleprompter_path_idx" ON "pages_blocks_teleprompter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_teleprompter_items_order_idx" ON "_pages_v_blocks_teleprompter_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_teleprompter_items_parent_id_idx" ON "_pages_v_blocks_teleprompter_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_teleprompter_items_icon_idx" ON "_pages_v_blocks_teleprompter_items" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_teleprompter_order_idx" ON "_pages_v_blocks_teleprompter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_teleprompter_parent_id_idx" ON "_pages_v_blocks_teleprompter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_teleprompter_path_idx" ON "_pages_v_blocks_teleprompter" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_teleprompter_items" CASCADE;
  DROP TABLE "pages_blocks_teleprompter" CASCADE;
  DROP TABLE "_pages_v_blocks_teleprompter_items" CASCADE;
  DROP TABLE "_pages_v_blocks_teleprompter" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_separator_type";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_direction";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_height";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_item_gap";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_icon_size";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_font_size";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_font_weight";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_font";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_text_transform";
  DROP TYPE "public"."enum_pages_blocks_teleprompter_letter_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_separator_type";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_direction";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_height";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_item_gap";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_font_size";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_font_weight";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_font";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_text_transform";
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_letter_spacing";`)
}

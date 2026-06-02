import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_services_grid_header_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_card_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_header_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_card_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TABLE "pages_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" jsonb,
  	"description" jsonb,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"header_font" "enum_pages_blocks_services_grid_header_font" DEFAULT 'Montserrat, sans-serif',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"card_font" "enum_pages_blocks_services_grid_card_font" DEFAULT 'Montserrat, sans-serif',
  	"card_background" varchar DEFAULT '#f3f3f3',
  	"text_color_rest" varchar DEFAULT '#1e1e1c',
  	"accent_color" varchar DEFAULT '#FFC950',
  	"hover_fill_color" varchar DEFAULT '#FFC950',
  	"text_color_hover" varchar DEFAULT '#1e1e1c',
  	"accent_color_hover" varchar DEFAULT '#f3f3f3',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" jsonb,
  	"description" jsonb,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" jsonb,
  	"heading" jsonb,
  	"header_font" "enum__pages_v_blocks_services_grid_header_font" DEFAULT 'Montserrat, sans-serif',
  	"eyebrow_color" varchar DEFAULT '#FFC950',
  	"heading_color" varchar DEFAULT '#1e1e1c',
  	"card_font" "enum__pages_v_blocks_services_grid_card_font" DEFAULT 'Montserrat, sans-serif',
  	"card_background" varchar DEFAULT '#f3f3f3',
  	"text_color_rest" varchar DEFAULT '#1e1e1c',
  	"accent_color" varchar DEFAULT '#FFC950',
  	"hover_fill_color" varchar DEFAULT '#FFC950',
  	"text_color_hover" varchar DEFAULT '#1e1e1c',
  	"accent_color_hover" varchar DEFAULT '#f3f3f3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_services_grid_services" ADD CONSTRAINT "pages_blocks_services_grid_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_services" ADD CONSTRAINT "pages_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_services_grid_services_order_idx" ON "pages_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_services_parent_id_idx" ON "pages_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_services_icon_idx" ON "pages_blocks_services_grid_services" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_grid_services_order_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_services_parent_id_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_services_icon_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_services_grid_services" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid_services" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_services_grid_header_font";
  DROP TYPE "public"."enum_pages_blocks_services_grid_card_font";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_header_font";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_card_font";`)
}

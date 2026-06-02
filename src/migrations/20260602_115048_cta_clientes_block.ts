import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_clientes_slides_per_view_desktop" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_cta_clientes_padding_top" AS ENUM('0', '60', '100', '120');
  CREATE TYPE "public"."enum_pages_blocks_cta_clientes_padding_bottom" AS ENUM('0', '50', '80', '100');
  CREATE TYPE "public"."enum_pages_blocks_cta_clientes_logo_size" AS ENUM('120', '150', '183', '220', '260');
  CREATE TYPE "public"."enum_pages_blocks_cta_clientes_hover_scale" AS ENUM('1.05', '1.1', '1.15', '1.2');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_slides_per_view_desktop" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_padding_top" AS ENUM('0', '60', '100', '120');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_padding_bottom" AS ENUM('0', '50', '80', '100');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_logo_size" AS ENUM('120', '150', '183', '220', '260');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_hover_scale" AS ENUM('1.05', '1.1', '1.15', '1.2');
  CREATE TABLE "pages_blocks_cta_clientes_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_cta_clientes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT '+ Clientes',
  	"cta_url" varchar DEFAULT '/clientes/',
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"enable_carousel" boolean DEFAULT false,
  	"slides_per_view_desktop" "enum_pages_blocks_cta_clientes_slides_per_view_desktop" DEFAULT '4',
  	"autoplay_delay" numeric DEFAULT 2500,
  	"transition_speed" numeric DEFAULT 400,
  	"pause_on_hover" boolean DEFAULT true,
  	"padding_top" "enum_pages_blocks_cta_clientes_padding_top" DEFAULT '100',
  	"padding_bottom" "enum_pages_blocks_cta_clientes_padding_bottom" DEFAULT '50',
  	"logo_size" "enum_pages_blocks_cta_clientes_logo_size" DEFAULT '183',
  	"hover_scale" "enum_pages_blocks_cta_clientes_hover_scale" DEFAULT '1.1',
  	"show_border_bottom" boolean DEFAULT true,
  	"background_color" varchar DEFAULT '#ffffff',
  	"border_color" varchar DEFAULT '#e5e7eb',
  	"cta_color" varchar DEFAULT '#1e1e1c',
  	"cta_hover_color" varchar DEFAULT '#FFC950',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_clientes_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_clientes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar DEFAULT '+ Clientes',
  	"cta_url" varchar DEFAULT '/clientes/',
  	"cta_open_in_new_tab" boolean DEFAULT false,
  	"enable_carousel" boolean DEFAULT false,
  	"slides_per_view_desktop" "enum__pages_v_blocks_cta_clientes_slides_per_view_desktop" DEFAULT '4',
  	"autoplay_delay" numeric DEFAULT 2500,
  	"transition_speed" numeric DEFAULT 400,
  	"pause_on_hover" boolean DEFAULT true,
  	"padding_top" "enum__pages_v_blocks_cta_clientes_padding_top" DEFAULT '100',
  	"padding_bottom" "enum__pages_v_blocks_cta_clientes_padding_bottom" DEFAULT '50',
  	"logo_size" "enum__pages_v_blocks_cta_clientes_logo_size" DEFAULT '183',
  	"hover_scale" "enum__pages_v_blocks_cta_clientes_hover_scale" DEFAULT '1.1',
  	"show_border_bottom" boolean DEFAULT true,
  	"background_color" varchar DEFAULT '#ffffff',
  	"border_color" varchar DEFAULT '#e5e7eb',
  	"cta_color" varchar DEFAULT '#1e1e1c',
  	"cta_hover_color" varchar DEFAULT '#FFC950',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_cta_clientes_logos" ADD CONSTRAINT "pages_blocks_cta_clientes_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_clientes_logos" ADD CONSTRAINT "pages_blocks_cta_clientes_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_clientes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_clientes" ADD CONSTRAINT "pages_blocks_cta_clientes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_clientes_logos" ADD CONSTRAINT "_pages_v_blocks_cta_clientes_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_clientes_logos" ADD CONSTRAINT "_pages_v_blocks_cta_clientes_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_clientes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_clientes" ADD CONSTRAINT "_pages_v_blocks_cta_clientes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_clientes_logos_order_idx" ON "pages_blocks_cta_clientes_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_clientes_logos_parent_id_idx" ON "pages_blocks_cta_clientes_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_clientes_logos_image_idx" ON "pages_blocks_cta_clientes_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_cta_clientes_order_idx" ON "pages_blocks_cta_clientes" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_clientes_parent_id_idx" ON "pages_blocks_cta_clientes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_clientes_path_idx" ON "pages_blocks_cta_clientes" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_clientes_logos_order_idx" ON "_pages_v_blocks_cta_clientes_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_clientes_logos_parent_id_idx" ON "_pages_v_blocks_cta_clientes_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_clientes_logos_image_idx" ON "_pages_v_blocks_cta_clientes_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_cta_clientes_order_idx" ON "_pages_v_blocks_cta_clientes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_clientes_parent_id_idx" ON "_pages_v_blocks_cta_clientes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_clientes_path_idx" ON "_pages_v_blocks_cta_clientes" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_cta_clientes_logos" CASCADE;
  DROP TABLE "pages_blocks_cta_clientes" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_clientes_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_clientes" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_slides_per_view_desktop";
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_padding_top";
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_logo_size";
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_hover_scale";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_slides_per_view_desktop";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_logo_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_hover_scale";`)
}

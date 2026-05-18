import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_layout_soria2_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_pages_blocks_layout_soria2_font_family" AS ENUM('default', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_soria2_image_position" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_soria2_font_family" AS ENUM('default', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TABLE "ls2_st" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_layout_soria2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"heading" varchar DEFAULT 'Comprometidos con tu hogar y negocio',
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"image_position" "enum_pages_blocks_layout_soria2_image_position" DEFAULT 'right',
  	"background_color" varchar DEFAULT '#1a1a1a',
  	"heading_color" varchar DEFAULT '#ffffff',
  	"description_color" varchar DEFAULT '#f5f5f5',
  	"stat_card_background" varchar DEFAULT '#ffffff',
  	"stat_number_color" varchar DEFAULT '#0a0a0a',
  	"stat_label_color" varchar DEFAULT '#404040',
  	"corner_radius" numeric DEFAULT 16,
  	"font_family" "enum_pages_blocks_layout_soria2_font_family" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "_ls2_st_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_layout_soria2" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"heading" varchar DEFAULT 'Comprometidos con tu hogar y negocio',
  	"description" varchar,
  	"image_id" integer,
  	"image_alt" varchar,
  	"image_position" "enum__pages_v_blocks_layout_soria2_image_position" DEFAULT 'right',
  	"background_color" varchar DEFAULT '#1a1a1a',
  	"heading_color" varchar DEFAULT '#ffffff',
  	"description_color" varchar DEFAULT '#f5f5f5',
  	"stat_card_background" varchar DEFAULT '#ffffff',
  	"stat_number_color" varchar DEFAULT '#0a0a0a',
  	"stat_label_color" varchar DEFAULT '#404040',
  	"corner_radius" numeric DEFAULT 16,
  	"font_family" "enum__pages_v_blocks_layout_soria2_font_family" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "ls2_st" ADD CONSTRAINT "ls2_st_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_layout_soria2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_soria2" ADD CONSTRAINT "pages_blocks_layout_soria2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_soria2" ADD CONSTRAINT "pages_blocks_layout_soria2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ls2_st_v" ADD CONSTRAINT "_ls2_st_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_layout_soria2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_soria2" ADD CONSTRAINT "_pages_v_blocks_layout_soria2_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_soria2" ADD CONSTRAINT "_pages_v_blocks_layout_soria2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "ls2_st_order_idx" ON "ls2_st" USING btree ("_order");
  CREATE INDEX "ls2_st_parent_id_idx" ON "ls2_st" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_layout_soria2_order_idx" ON "pages_blocks_layout_soria2" USING btree ("_order");
  CREATE INDEX "pages_blocks_layout_soria2_parent_id_idx" ON "pages_blocks_layout_soria2" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_layout_soria2_path_idx" ON "pages_blocks_layout_soria2" USING btree ("_path");
  CREATE INDEX "pages_blocks_layout_soria2_image_idx" ON "pages_blocks_layout_soria2" USING btree ("image_id");
  CREATE INDEX "_ls2_st_v_order_idx" ON "_ls2_st_v" USING btree ("_order");
  CREATE INDEX "_ls2_st_v_parent_id_idx" ON "_ls2_st_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_layout_soria2_order_idx" ON "_pages_v_blocks_layout_soria2" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_layout_soria2_parent_id_idx" ON "_pages_v_blocks_layout_soria2" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_layout_soria2_path_idx" ON "_pages_v_blocks_layout_soria2" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_layout_soria2_image_idx" ON "_pages_v_blocks_layout_soria2" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "ls2_st" CASCADE;
  DROP TABLE "pages_blocks_layout_soria2" CASCADE;
  DROP TABLE "_ls2_st_v" CASCADE;
  DROP TABLE "_pages_v_blocks_layout_soria2" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_layout_soria2_image_position";
  DROP TYPE "public"."enum_pages_blocks_layout_soria2_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_layout_soria2_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_layout_soria2_font_family";`)
}

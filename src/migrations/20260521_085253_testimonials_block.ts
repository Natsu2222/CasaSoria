import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_testimonials_quote_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_attribution_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_name_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_role_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_quote_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_attribution_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_name_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_role_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"quote" jsonb,
  	"attribution" jsonb,
  	"name" jsonb,
  	"role" jsonb
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"background_image_id" integer,
  	"autoplay" boolean DEFAULT false,
  	"autoplay_ms" numeric DEFAULT 5000,
  	"background_color" varchar,
  	"accent_color" varchar,
  	"max_width" varchar,
  	"min_height" varchar,
  	"card_background_color" varchar,
  	"card_shadow" varchar,
  	"quote_color" varchar,
  	"quote_font_family" "enum_pages_blocks_testimonials_quote_font_family" DEFAULT 'default',
  	"attribution_color" varchar,
  	"attribution_font_family" "enum_pages_blocks_testimonials_attribution_font_family" DEFAULT 'default',
  	"name_color" varchar,
  	"name_font_family" "enum_pages_blocks_testimonials_name_font_family" DEFAULT 'default',
  	"role_color" varchar,
  	"role_font_family" "enum_pages_blocks_testimonials_role_font_family" DEFAULT 'default',
  	"arrow_color" varchar,
  	"arrow_background_color" varchar,
  	"dot_color" varchar,
  	"dot_active_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"quote" jsonb,
  	"attribution" jsonb,
  	"name" jsonb,
  	"role" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"background_image_id" integer,
  	"autoplay" boolean DEFAULT false,
  	"autoplay_ms" numeric DEFAULT 5000,
  	"background_color" varchar,
  	"accent_color" varchar,
  	"max_width" varchar,
  	"min_height" varchar,
  	"card_background_color" varchar,
  	"card_shadow" varchar,
  	"quote_color" varchar,
  	"quote_font_family" "enum__pages_v_blocks_testimonials_quote_font_family" DEFAULT 'default',
  	"attribution_color" varchar,
  	"attribution_font_family" "enum__pages_v_blocks_testimonials_attribution_font_family" DEFAULT 'default',
  	"name_color" varchar,
  	"name_font_family" "enum__pages_v_blocks_testimonials_name_font_family" DEFAULT 'default',
  	"role_color" varchar,
  	"role_font_family" "enum__pages_v_blocks_testimonials_role_font_family" DEFAULT 'default',
  	"arrow_color" varchar,
  	"arrow_background_color" varchar,
  	"dot_color" varchar,
  	"dot_active_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_items_avatar_idx" ON "pages_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_background_image_idx" ON "pages_blocks_testimonials" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_items_avatar_idx" ON "_pages_v_blocks_testimonials_items" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_background_image_idx" ON "_pages_v_blocks_testimonials" USING btree ("background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_testimonials_quote_font_family";
  DROP TYPE "public"."enum_pages_blocks_testimonials_attribution_font_family";
  DROP TYPE "public"."enum_pages_blocks_testimonials_name_font_family";
  DROP TYPE "public"."enum_pages_blocks_testimonials_role_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_quote_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_attribution_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_name_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_role_font_family";`)
}

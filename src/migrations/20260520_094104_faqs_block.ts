import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_faqs_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_faqs_subtitle_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_faqs_question_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_faqs_answer_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_subtitle_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_question_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_faqs_answer_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TABLE "pages_blocks_faqs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" jsonb,
  	"answer" jsonb,
  	"default_open" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" jsonb,
  	"subtitle" jsonb,
  	"allow_multiple_open" boolean DEFAULT false,
  	"background_color" varchar,
  	"max_width" varchar,
  	"title_color" varchar,
  	"title_font_family" "enum_pages_blocks_faqs_title_font_family" DEFAULT 'default',
  	"subtitle_color" varchar,
  	"subtitle_font_family" "enum_pages_blocks_faqs_subtitle_font_family" DEFAULT 'default',
  	"card_background_color" varchar,
  	"card_border_color" varchar,
  	"question_color" varchar,
  	"question_font_family" "enum_pages_blocks_faqs_question_font_family" DEFAULT 'default',
  	"answer_color" varchar,
  	"answer_font_family" "enum_pages_blocks_faqs_answer_font_family" DEFAULT 'default',
  	"icon_background_color" varchar,
  	"icon_color" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faqs_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" jsonb,
  	"answer" jsonb,
  	"default_open" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar,
  	"title" jsonb,
  	"subtitle" jsonb,
  	"allow_multiple_open" boolean DEFAULT false,
  	"background_color" varchar,
  	"max_width" varchar,
  	"title_color" varchar,
  	"title_font_family" "enum__pages_v_blocks_faqs_title_font_family" DEFAULT 'default',
  	"subtitle_color" varchar,
  	"subtitle_font_family" "enum__pages_v_blocks_faqs_subtitle_font_family" DEFAULT 'default',
  	"card_background_color" varchar,
  	"card_border_color" varchar,
  	"question_color" varchar,
  	"question_font_family" "enum__pages_v_blocks_faqs_question_font_family" DEFAULT 'default',
  	"answer_color" varchar,
  	"answer_font_family" "enum__pages_v_blocks_faqs_answer_font_family" DEFAULT 'default',
  	"icon_background_color" varchar,
  	"icon_color" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_faqs_items" ADD CONSTRAINT "pages_blocks_faqs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faqs" ADD CONSTRAINT "pages_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faqs_items" ADD CONSTRAINT "_pages_v_blocks_faqs_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faqs" ADD CONSTRAINT "_pages_v_blocks_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_faqs_items_order_idx" ON "pages_blocks_faqs_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faqs_items_parent_id_idx" ON "pages_blocks_faqs_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faqs_order_idx" ON "pages_blocks_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faqs_parent_id_idx" ON "pages_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faqs_path_idx" ON "pages_blocks_faqs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faqs_items_order_idx" ON "_pages_v_blocks_faqs_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faqs_items_parent_id_idx" ON "_pages_v_blocks_faqs_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faqs_order_idx" ON "_pages_v_blocks_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faqs_parent_id_idx" ON "_pages_v_blocks_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faqs_path_idx" ON "_pages_v_blocks_faqs" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_faqs_items" CASCADE;
  DROP TABLE "pages_blocks_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faqs_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faqs" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_faqs_title_font_family";
  DROP TYPE "public"."enum_pages_blocks_faqs_subtitle_font_family";
  DROP TYPE "public"."enum_pages_blocks_faqs_question_font_family";
  DROP TYPE "public"."enum_pages_blocks_faqs_answer_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_title_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_subtitle_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_question_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_faqs_answer_font_family";`)
}

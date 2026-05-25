import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_footer_soria_social_links_icon" AS ENUM('whatsapp', 'instagram', 'linkedin', 'facebook', 'mail', 'phone', 'external');
  CREATE TYPE "public"."enum_footer_footer_soria_social_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_footer_soria_legal_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_type" AS ENUM('default', 'footerSoria');
  CREATE TYPE "public"."enum_footer_footer_soria_brand_link_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_footer_soria_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TABLE "footer_footer_soria_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_footer_footer_soria_social_links_icon" DEFAULT 'external',
  	"label" jsonb,
  	"link_type" "enum_footer_footer_soria_social_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_footer_soria_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" jsonb,
  	"link_type" "enum_footer_footer_soria_legal_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  ALTER TABLE "footer_nav_items" ALTER COLUMN "link_label" DROP NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "type" "enum_footer_type" DEFAULT 'default' NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_logo_id" integer;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_brand_text" jsonb;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_brand_link_link_type" "enum_footer_footer_soria_brand_link_link_type" DEFAULT 'reference';
  ALTER TABLE "footer" ADD COLUMN "footer_soria_brand_link_link_new_tab" boolean;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_brand_link_link_url" varchar;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_brand_link_link_label" varchar;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_copyright" jsonb;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_background_color" varchar;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_text_color" varchar;
  ALTER TABLE "footer" ADD COLUMN "footer_soria_font_family" "enum_footer_footer_soria_font_family" DEFAULT 'default';
  ALTER TABLE "footer_footer_soria_social_links" ADD CONSTRAINT "footer_footer_soria_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_footer_soria_legal_links" ADD CONSTRAINT "footer_footer_soria_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_footer_soria_social_links_order_idx" ON "footer_footer_soria_social_links" USING btree ("_order");
  CREATE INDEX "footer_footer_soria_social_links_parent_id_idx" ON "footer_footer_soria_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_footer_soria_legal_links_order_idx" ON "footer_footer_soria_legal_links" USING btree ("_order");
  CREATE INDEX "footer_footer_soria_legal_links_parent_id_idx" ON "footer_footer_soria_legal_links" USING btree ("_parent_id");
  ALTER TABLE "footer" ADD CONSTRAINT "footer_footer_soria_logo_id_media_id_fk" FOREIGN KEY ("footer_soria_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "footer_footer_soria_footer_soria_logo_idx" ON "footer" USING btree ("footer_soria_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_footer_soria_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_footer_soria_legal_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "footer_footer_soria_social_links" CASCADE;
  DROP TABLE "footer_footer_soria_legal_links" CASCADE;
  ALTER TABLE "footer" DROP CONSTRAINT "footer_footer_soria_logo_id_media_id_fk";
  
  DROP INDEX "footer_footer_soria_footer_soria_logo_idx";
  ALTER TABLE "footer_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
  ALTER TABLE "footer" DROP COLUMN "type";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_logo_id";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_brand_text";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_brand_link_link_type";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_brand_link_link_new_tab";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_brand_link_link_url";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_brand_link_link_label";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_copyright";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_background_color";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_text_color";
  ALTER TABLE "footer" DROP COLUMN "footer_soria_font_family";
  DROP TYPE "public"."enum_footer_footer_soria_social_links_icon";
  DROP TYPE "public"."enum_footer_footer_soria_social_links_link_type";
  DROP TYPE "public"."enum_footer_footer_soria_legal_links_link_type";
  DROP TYPE "public"."enum_footer_type";
  DROP TYPE "public"."enum_footer_footer_soria_brand_link_link_type";
  DROP TYPE "public"."enum_footer_footer_soria_font_family";`)
}

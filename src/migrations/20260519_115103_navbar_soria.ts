import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_navbar_soria_sidebar_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_type" AS ENUM('default', 'navbarSoria');
  CREATE TYPE "public"."enum_header_navbar_soria_cta_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "header_navbar_soria_sidebar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_navbar_soria_sidebar_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_label" DROP NOT NULL;
  ALTER TABLE "header" ADD COLUMN "type" "enum_header_type" DEFAULT 'default' NOT NULL;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_logo_id" integer;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_logo_text" varchar;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_cta_link_type" "enum_header_navbar_soria_cta_link_type" DEFAULT 'reference';
  ALTER TABLE "header" ADD COLUMN "navbar_soria_cta_link_new_tab" boolean;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_cta_link_url" varchar;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_cta_link_label" varchar;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_background_color" varchar;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_text_color" varchar;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_sticky" boolean DEFAULT true;
  ALTER TABLE "header" ADD COLUMN "navbar_soria_show_hamburger_on_desktop" boolean DEFAULT false;
  ALTER TABLE "header_navbar_soria_sidebar_items" ADD CONSTRAINT "header_navbar_soria_sidebar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_navbar_soria_sidebar_items_order_idx" ON "header_navbar_soria_sidebar_items" USING btree ("_order");
  CREATE INDEX "header_navbar_soria_sidebar_items_parent_id_idx" ON "header_navbar_soria_sidebar_items" USING btree ("_parent_id");
  ALTER TABLE "header" ADD CONSTRAINT "header_navbar_soria_logo_id_media_id_fk" FOREIGN KEY ("navbar_soria_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "header_navbar_soria_navbar_soria_logo_idx" ON "header" USING btree ("navbar_soria_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_navbar_soria_sidebar_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_navbar_soria_sidebar_items" CASCADE;
  ALTER TABLE "header" DROP CONSTRAINT "header_navbar_soria_logo_id_media_id_fk";
  
  DROP INDEX "header_navbar_soria_navbar_soria_logo_idx";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
  ALTER TABLE "header" DROP COLUMN "type";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_logo_id";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_logo_text";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_cta_link_type";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_cta_link_new_tab";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_cta_link_url";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_cta_link_label";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_background_color";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_text_color";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_sticky";
  ALTER TABLE "header" DROP COLUMN "navbar_soria_show_hamburger_on_desktop";
  DROP TYPE "public"."enum_header_navbar_soria_sidebar_items_link_type";
  DROP TYPE "public"."enum_header_type";
  DROP TYPE "public"."enum_header_navbar_soria_cta_link_type";`)
}

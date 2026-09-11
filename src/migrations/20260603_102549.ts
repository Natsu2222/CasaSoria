import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_testimonials_minery_background_position" AS ENUM('center center', 'center top', 'center bottom', 'left center', 'right center');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_minery_padding_y" AS ENUM('60', '90', '120', '160');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_minery_founder_image_size" AS ENUM('50', '70', '90', '110');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_minery_quote_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_minery_founder_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_minery_background_position" AS ENUM('center center', 'center top', 'center bottom', 'left center', 'right center');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_minery_padding_y" AS ENUM('60', '90', '120', '160');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_minery_founder_image_size" AS ENUM('50', '70', '90', '110');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_minery_quote_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_minery_founder_font" AS ENUM('Montserrat, sans-serif', 'Inter, sans-serif', 'Roboto, sans-serif', 'Lato, sans-serif', 'Open Sans, sans-serif', 'Raleway, sans-serif', 'Poppins, sans-serif', 'Playfair Display, serif', 'Georgia, serif');
  CREATE TABLE "pages_blocks_testimonials_minery_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" jsonb,
  	"founder_image_id" integer,
  	"founder_name" varchar,
  	"founder_role" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_minery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"background_position" "enum_pages_blocks_testimonials_minery_background_position" DEFAULT 'center center',
  	"overlay_color" varchar,
  	"disable_parallax_on_touch" boolean DEFAULT true,
  	"enable_autoplay" boolean DEFAULT false,
  	"autoplay_delay" numeric DEFAULT 4000,
  	"transition_speed" numeric DEFAULT 400,
  	"loop" boolean DEFAULT true,
  	"padding_y" "enum_pages_blocks_testimonials_minery_padding_y" DEFAULT '90',
  	"founder_image_size" "enum_pages_blocks_testimonials_minery_founder_image_size" DEFAULT '70',
  	"quote_font" "enum_pages_blocks_testimonials_minery_quote_font" DEFAULT 'Montserrat, sans-serif',
  	"founder_font" "enum_pages_blocks_testimonials_minery_founder_font" DEFAULT 'Montserrat, sans-serif',
  	"quote_icon_color" varchar DEFAULT '#ffffff',
  	"quote_text_color" varchar DEFAULT '#ffffff',
  	"founder_name_color" varchar DEFAULT '#ffffff',
  	"founder_role_color" varchar DEFAULT '#ffffff',
  	"arrow_color" varchar DEFAULT '#ffffff',
  	"arrow_hover_color" varchar DEFAULT '#FFC950',
  	"arrow_border_color" varchar DEFAULT 'rgba(255,255,255,0.4)',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_minery_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" jsonb,
  	"founder_image_id" integer,
  	"founder_name" varchar,
  	"founder_role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_minery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"background_position" "enum__pages_v_blocks_testimonials_minery_background_position" DEFAULT 'center center',
  	"overlay_color" varchar,
  	"disable_parallax_on_touch" boolean DEFAULT true,
  	"enable_autoplay" boolean DEFAULT false,
  	"autoplay_delay" numeric DEFAULT 4000,
  	"transition_speed" numeric DEFAULT 400,
  	"loop" boolean DEFAULT true,
  	"padding_y" "enum__pages_v_blocks_testimonials_minery_padding_y" DEFAULT '90',
  	"founder_image_size" "enum__pages_v_blocks_testimonials_minery_founder_image_size" DEFAULT '70',
  	"quote_font" "enum__pages_v_blocks_testimonials_minery_quote_font" DEFAULT 'Montserrat, sans-serif',
  	"founder_font" "enum__pages_v_blocks_testimonials_minery_founder_font" DEFAULT 'Montserrat, sans-serif',
  	"quote_icon_color" varchar DEFAULT '#ffffff',
  	"quote_text_color" varchar DEFAULT '#ffffff',
  	"founder_name_color" varchar DEFAULT '#ffffff',
  	"founder_role_color" varchar DEFAULT '#ffffff',
  	"arrow_color" varchar DEFAULT '#ffffff',
  	"arrow_hover_color" varchar DEFAULT '#FFC950',
  	"arrow_border_color" varchar DEFAULT 'rgba(255,255,255,0.4)',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_cta_clientes" ALTER COLUMN "enable_carousel" SET DEFAULT true;
  ALTER TABLE "_pages_v_blocks_cta_clientes" ALTER COLUMN "enable_carousel" SET DEFAULT true;
  ALTER TABLE "pages_blocks_testimonials_minery_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_minery_testimonials_founder_image_id_media_id_fk" FOREIGN KEY ("founder_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_minery_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_minery_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials_minery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_minery" ADD CONSTRAINT "pages_blocks_testimonials_minery_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_minery" ADD CONSTRAINT "pages_blocks_testimonials_minery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_minery_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_minery_testimonials_founder_image_id_media_id_fk" FOREIGN KEY ("founder_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_minery_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_minery_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials_minery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_minery" ADD CONSTRAINT "_pages_v_blocks_testimonials_minery_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_minery" ADD CONSTRAINT "_pages_v_blocks_testimonials_minery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_testimonials_minery_testimonials_order_idx" ON "pages_blocks_testimonials_minery_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_minery_testimonials_parent_id_idx" ON "pages_blocks_testimonials_minery_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_minery_testimonials_founder_im_idx" ON "pages_blocks_testimonials_minery_testimonials" USING btree ("founder_image_id");
  CREATE INDEX "pages_blocks_testimonials_minery_order_idx" ON "pages_blocks_testimonials_minery" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_minery_parent_id_idx" ON "pages_blocks_testimonials_minery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_minery_path_idx" ON "pages_blocks_testimonials_minery" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_minery_background_image_idx" ON "pages_blocks_testimonials_minery" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_testimonials_order_idx" ON "_pages_v_blocks_testimonials_minery_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_minery_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_testimonials_founder_idx" ON "_pages_v_blocks_testimonials_minery_testimonials" USING btree ("founder_image_id");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_order_idx" ON "_pages_v_blocks_testimonials_minery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_parent_id_idx" ON "_pages_v_blocks_testimonials_minery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_path_idx" ON "_pages_v_blocks_testimonials_minery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_minery_background_image_idx" ON "_pages_v_blocks_testimonials_minery" USING btree ("background_image_id");
  ALTER TABLE "pages_blocks_cta_clientes" DROP COLUMN "slides_per_view_desktop";
  ALTER TABLE "pages_blocks_cta_clientes" DROP COLUMN "logo_size";
  ALTER TABLE "pages_blocks_cta_clientes" DROP COLUMN "show_border_bottom";
  ALTER TABLE "pages_blocks_cta_clientes" DROP COLUMN "border_color";
  ALTER TABLE "_pages_v_blocks_cta_clientes" DROP COLUMN "slides_per_view_desktop";
  ALTER TABLE "_pages_v_blocks_cta_clientes" DROP COLUMN "logo_size";
  ALTER TABLE "_pages_v_blocks_cta_clientes" DROP COLUMN "show_border_bottom";
  ALTER TABLE "_pages_v_blocks_cta_clientes" DROP COLUMN "border_color";
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_slides_per_view_desktop";
  DROP TYPE "public"."enum_pages_blocks_cta_clientes_logo_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_slides_per_view_desktop";
  DROP TYPE "public"."enum__pages_v_blocks_cta_clientes_logo_size";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_clientes_slides_per_view_desktop" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_cta_clientes_logo_size" AS ENUM('120', '150', '183', '220', '260');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_slides_per_view_desktop" AS ENUM('3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_clientes_logo_size" AS ENUM('120', '150', '183', '220', '260');
  ALTER TABLE "pages_blocks_testimonials_minery_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_minery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_minery_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_minery" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_testimonials_minery_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials_minery" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_minery_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_minery" CASCADE;
  ALTER TABLE "pages_blocks_cta_clientes" ALTER COLUMN "enable_carousel" SET DEFAULT false;
  ALTER TABLE "_pages_v_blocks_cta_clientes" ALTER COLUMN "enable_carousel" SET DEFAULT false;
  ALTER TABLE "pages_blocks_cta_clientes" ADD COLUMN "slides_per_view_desktop" "enum_pages_blocks_cta_clientes_slides_per_view_desktop" DEFAULT '4';
  ALTER TABLE "pages_blocks_cta_clientes" ADD COLUMN "logo_size" "enum_pages_blocks_cta_clientes_logo_size" DEFAULT '183';
  ALTER TABLE "pages_blocks_cta_clientes" ADD COLUMN "show_border_bottom" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_cta_clientes" ADD COLUMN "border_color" varchar DEFAULT '#e5e7eb';
  ALTER TABLE "_pages_v_blocks_cta_clientes" ADD COLUMN "slides_per_view_desktop" "enum__pages_v_blocks_cta_clientes_slides_per_view_desktop" DEFAULT '4';
  ALTER TABLE "_pages_v_blocks_cta_clientes" ADD COLUMN "logo_size" "enum__pages_v_blocks_cta_clientes_logo_size" DEFAULT '183';
  ALTER TABLE "_pages_v_blocks_cta_clientes" ADD COLUMN "show_border_bottom" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_cta_clientes" ADD COLUMN "border_color" varchar DEFAULT '#e5e7eb';
  DROP TYPE "public"."enum_pages_blocks_testimonials_minery_background_position";
  DROP TYPE "public"."enum_pages_blocks_testimonials_minery_padding_y";
  DROP TYPE "public"."enum_pages_blocks_testimonials_minery_founder_image_size";
  DROP TYPE "public"."enum_pages_blocks_testimonials_minery_quote_font";
  DROP TYPE "public"."enum_pages_blocks_testimonials_minery_founder_font";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_minery_background_position";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_minery_padding_y";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_minery_founder_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_minery_quote_font";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_minery_founder_font";`)
}

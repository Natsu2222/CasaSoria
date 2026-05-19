import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_products_block_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_products_block_description_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_location_block_heading_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum_pages_blocks_location_block_body_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_products_block_title_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_products_block_description_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_location_block_heading_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  CREATE TYPE "public"."enum__pages_v_blocks_location_block_body_font_family" AS ENUM('default', '"Instrument Serif", serif', 'Arial, sans-serif', '"Times New Roman", serif', 'Georgia, serif', 'Verdana, sans-serif', 'Helvetica, Arial, sans-serif', '"Courier New", monospace', '"Roboto", sans-serif', '"Open Sans", sans-serif', '"Lato", sans-serif', '"Montserrat", sans-serif', '"Playfair Display", serif', '"Inter", sans-serif', '"Poppins", sans-serif', '"Raleway", sans-serif');
  ALTER TABLE "header" ALTER COLUMN "navbar_soria_sticky" SET DEFAULT false;
  ALTER TABLE "pages_blocks_products_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "pages_blocks_products_block" ADD COLUMN "text_color" varchar;
  ALTER TABLE "pages_blocks_products_block" ADD COLUMN "title_font_family" "enum_pages_blocks_products_block_title_font_family" DEFAULT 'default';
  ALTER TABLE "pages_blocks_products_block" ADD COLUMN "description_font_family" "enum_pages_blocks_products_block_description_font_family" DEFAULT 'default';
  ALTER TABLE "pages_blocks_location_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "pages_blocks_location_block" ADD COLUMN "text_color" varchar;
  ALTER TABLE "pages_blocks_location_block" ADD COLUMN "heading_font_family" "enum_pages_blocks_location_block_heading_font_family" DEFAULT 'default';
  ALTER TABLE "pages_blocks_location_block" ADD COLUMN "body_font_family" "enum_pages_blocks_location_block_body_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_products_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "_pages_v_blocks_products_block" ADD COLUMN "text_color" varchar;
  ALTER TABLE "_pages_v_blocks_products_block" ADD COLUMN "title_font_family" "enum__pages_v_blocks_products_block_title_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_products_block" ADD COLUMN "description_font_family" "enum__pages_v_blocks_products_block_description_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_location_block" ADD COLUMN "background_color" varchar;
  ALTER TABLE "_pages_v_blocks_location_block" ADD COLUMN "text_color" varchar;
  ALTER TABLE "_pages_v_blocks_location_block" ADD COLUMN "heading_font_family" "enum__pages_v_blocks_location_block_heading_font_family" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_location_block" ADD COLUMN "body_font_family" "enum__pages_v_blocks_location_block_body_font_family" DEFAULT 'default';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" ALTER COLUMN "navbar_soria_sticky" SET DEFAULT true;
  ALTER TABLE "pages_blocks_products_block" DROP COLUMN "background_color";
  ALTER TABLE "pages_blocks_products_block" DROP COLUMN "text_color";
  ALTER TABLE "pages_blocks_products_block" DROP COLUMN "title_font_family";
  ALTER TABLE "pages_blocks_products_block" DROP COLUMN "description_font_family";
  ALTER TABLE "pages_blocks_location_block" DROP COLUMN "background_color";
  ALTER TABLE "pages_blocks_location_block" DROP COLUMN "text_color";
  ALTER TABLE "pages_blocks_location_block" DROP COLUMN "heading_font_family";
  ALTER TABLE "pages_blocks_location_block" DROP COLUMN "body_font_family";
  ALTER TABLE "_pages_v_blocks_products_block" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_products_block" DROP COLUMN "text_color";
  ALTER TABLE "_pages_v_blocks_products_block" DROP COLUMN "title_font_family";
  ALTER TABLE "_pages_v_blocks_products_block" DROP COLUMN "description_font_family";
  ALTER TABLE "_pages_v_blocks_location_block" DROP COLUMN "background_color";
  ALTER TABLE "_pages_v_blocks_location_block" DROP COLUMN "text_color";
  ALTER TABLE "_pages_v_blocks_location_block" DROP COLUMN "heading_font_family";
  ALTER TABLE "_pages_v_blocks_location_block" DROP COLUMN "body_font_family";
  DROP TYPE "public"."enum_pages_blocks_products_block_title_font_family";
  DROP TYPE "public"."enum_pages_blocks_products_block_description_font_family";
  DROP TYPE "public"."enum_pages_blocks_location_block_heading_font_family";
  DROP TYPE "public"."enum_pages_blocks_location_block_body_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_products_block_title_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_products_block_description_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_location_block_heading_font_family";
  DROP TYPE "public"."enum__pages_v_blocks_location_block_body_font_family";`)
}

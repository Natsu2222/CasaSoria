import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_teleprompter_height" ADD VALUE '200';
  ALTER TYPE "public"."enum_pages_blocks_teleprompter_height" ADD VALUE '240';
  ALTER TYPE "public"."enum__pages_v_blocks_teleprompter_height" ADD VALUE '200';
  ALTER TYPE "public"."enum__pages_v_blocks_teleprompter_height" ADD VALUE '240';
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::text;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_icon_size";
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_icon_size" AS ENUM('24', '32', '40', '48', '56', '64', '72', '80', '96', '112', '128', '160', '192');
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::"public"."enum_pages_blocks_teleprompter_icon_size";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_icon_size" USING "icon_size"::"public"."enum_pages_blocks_teleprompter_icon_size";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::text;
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size";
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" AS ENUM('24', '32', '40', '48', '56', '64', '72', '80', '96', '112', '128', '160', '192');
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::"public"."enum__pages_v_blocks_teleprompter_icon_size";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" USING "icon_size"::"public"."enum__pages_v_blocks_teleprompter_icon_size";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::text;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_height";
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_height" AS ENUM('40', '60', '80', '100', '120', '160');
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::"public"."enum_pages_blocks_teleprompter_height";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_height" USING "height"::"public"."enum_pages_blocks_teleprompter_height";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '32'::text;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_icon_size";
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_icon_size" AS ENUM('20', '24', '32', '40', '48', '56');
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '32'::"public"."enum_pages_blocks_teleprompter_icon_size";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_icon_size" USING "icon_size"::"public"."enum_pages_blocks_teleprompter_icon_size";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::text;
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_height";
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_height" AS ENUM('40', '60', '80', '100', '120', '160');
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::"public"."enum__pages_v_blocks_teleprompter_height";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_height" USING "height"::"public"."enum__pages_v_blocks_teleprompter_height";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '32'::text;
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size";
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" AS ENUM('20', '24', '32', '40', '48', '56');
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '32'::"public"."enum__pages_v_blocks_teleprompter_icon_size";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" USING "icon_size"::"public"."enum__pages_v_blocks_teleprompter_icon_size";`)
}

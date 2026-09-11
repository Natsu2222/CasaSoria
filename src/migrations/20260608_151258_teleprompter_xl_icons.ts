import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const XL_ICON_SIZES = [
  '48',
  '64',
  '80',
  '96',
  '128',
  '160',
  '192',
  '224',
  '256',
  '288',
  '320',
  '360',
  '400',
  '480',
  '560',
  '640',
] as const

const XL_ICON_ENUM = XL_ICON_SIZES.map((v) => `'${v}'`).join(', ')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const addEnumValue = async (type: string, value: string) => {
    await db.execute(sql.raw(`
      DO $$ BEGIN
        ALTER TYPE "public"."${type}" ADD VALUE '${value}';
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `))
  }

  const heightValues = ['280', '320', '360', '400', '480', '560', '640']
  const gapValues = ['96', '128', '160', '200']

  for (const value of heightValues) {
    await addEnumValue('enum_pages_blocks_teleprompter_height', value)
    await addEnumValue('enum__pages_v_blocks_teleprompter_height', value)
  }

  for (const value of gapValues) {
    await addEnumValue('enum_pages_blocks_teleprompter_item_gap', value)
    await addEnumValue('enum__pages_v_blocks_teleprompter_item_gap', value)
  }

  const allowedSizes = XL_ICON_SIZES.map((v) => `'${v}'`).join(', ')

  await db.execute(sql.raw(`
    ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
    ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;

    UPDATE "pages_blocks_teleprompter"
    SET "icon_size" = '48'
    WHERE "icon_size" IS NULL OR "icon_size" NOT IN (${allowedSizes});

    UPDATE "_pages_v_blocks_teleprompter"
    SET "icon_size" = '48'
    WHERE "icon_size" IS NULL OR "icon_size" NOT IN (${allowedSizes});

    ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::text;
    ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::text;

    DROP TYPE IF EXISTS "public"."enum_pages_blocks_teleprompter_icon_size";
    CREATE TYPE "public"."enum_pages_blocks_teleprompter_icon_size" AS ENUM(${XL_ICON_ENUM});

    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_teleprompter_icon_size";
    CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" AS ENUM(${XL_ICON_ENUM});

    ALTER TABLE "pages_blocks_teleprompter"
      ALTER COLUMN "icon_size" SET DEFAULT '48'::"public"."enum_pages_blocks_teleprompter_icon_size";
    ALTER TABLE "pages_blocks_teleprompter"
      ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_icon_size"
      USING "icon_size"::"public"."enum_pages_blocks_teleprompter_icon_size";

    ALTER TABLE "_pages_v_blocks_teleprompter"
      ALTER COLUMN "icon_size" SET DEFAULT '48'::"public"."enum__pages_v_blocks_teleprompter_icon_size";
    ALTER TABLE "_pages_v_blocks_teleprompter"
      ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size"
      USING "icon_size"::"public"."enum__pages_v_blocks_teleprompter_icon_size";
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::text;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_height";
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_height" AS ENUM('40', '60', '80', '100', '120', '160', '200', '240');
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::"public"."enum_pages_blocks_teleprompter_height";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_height" USING "height"::"public"."enum_pages_blocks_teleprompter_height";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "item_gap" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "item_gap" SET DEFAULT '48'::text;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_item_gap";
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_item_gap" AS ENUM('16', '24', '32', '48', '64', '80');
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "item_gap" SET DEFAULT '48'::"public"."enum_pages_blocks_teleprompter_item_gap";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "item_gap" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_item_gap" USING "item_gap"::"public"."enum_pages_blocks_teleprompter_item_gap";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::text;
  DROP TYPE "public"."enum_pages_blocks_teleprompter_icon_size";
  CREATE TYPE "public"."enum_pages_blocks_teleprompter_icon_size" AS ENUM('24', '32', '40', '48', '56', '64', '72', '80', '96', '112', '128', '160', '192');
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::"public"."enum_pages_blocks_teleprompter_icon_size";
  ALTER TABLE "pages_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum_pages_blocks_teleprompter_icon_size" USING "icon_size"::"public"."enum_pages_blocks_teleprompter_icon_size";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::text;
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_height";
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_height" AS ENUM('40', '60', '80', '100', '120', '160', '200', '240');
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DEFAULT '80'::"public"."enum__pages_v_blocks_teleprompter_height";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "height" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_height" USING "height"::"public"."enum__pages_v_blocks_teleprompter_height";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "item_gap" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "item_gap" SET DEFAULT '48'::text;
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_item_gap";
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_item_gap" AS ENUM('16', '24', '32', '48', '64', '80');
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "item_gap" SET DEFAULT '48'::"public"."enum__pages_v_blocks_teleprompter_item_gap";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "item_gap" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_item_gap" USING "item_gap"::"public"."enum__pages_v_blocks_teleprompter_item_gap";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::text;
  DROP TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size";
  CREATE TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" AS ENUM('24', '32', '40', '48', '56', '64', '72', '80', '96', '112', '128', '160', '192');
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DEFAULT '48'::"public"."enum__pages_v_blocks_teleprompter_icon_size";
  ALTER TABLE "_pages_v_blocks_teleprompter" ALTER COLUMN "icon_size" SET DATA TYPE "public"."enum__pages_v_blocks_teleprompter_icon_size" USING "icon_size"::"public"."enum__pages_v_blocks_teleprompter_icon_size";`)
}

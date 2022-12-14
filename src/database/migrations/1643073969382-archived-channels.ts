import {MigrationInterface, QueryRunner} from "typeorm";

export class archivedChannels1643073969382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `
CREATE TABLE IF NOT EXISTS public."archived-channels"
(
  id serial,
  name character varying COLLATE pg_catalog."default" NOT NULL,
  "storageUrl" character varying COLLATE pg_catalog."default" NOT NULL,
  provider character varying COLLATE pg_catalog."default" NOT NULL,
  directory character varying COLLATE pg_catalog."default" NOT NULL,
  url character varying COLLATE pg_catalog."default" NOT NULL,
  size character varying COLLATE pg_catalog."default" NOT NULL,
  "videosCount" integer NOT NULL,
  terminated boolean NOT NULL,
  featured boolean NOT NULL,
  critical boolean NOT NULL,
  profile boolean NOT NULL,
  banner boolean NOT NULL
);

ALTER TABLE IF EXISTS public."archived-channels"
  OWNER to videos;
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
DROP TABLE IF EXISTS public."archived-channels";
      `
    );
  }

}

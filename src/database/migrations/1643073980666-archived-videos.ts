import {MigrationInterface, QueryRunner} from "typeorm";

export class archivedVideos1643073980666 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
CREATE TABLE IF NOT EXISTS public."archived-videos"
(
  id serial,
  "videoId" character varying COLLATE pg_catalog."default" NOT NULL,
  title character varying COLLATE pg_catalog."default" NOT NULL,
  path character varying COLLATE pg_catalog."default" NOT NULL,
  url character varying COLLATE pg_catalog."default" NOT NULL,
  duration integer NOT NULL,
  uploaded character varying COLLATE pg_catalog."default" NOT NULL,
  tags json,
  width integer NOT NULL,
  height integer NOT NULL,
  "storageUrl" character varying COLLATE pg_catalog."default" NOT NULL,
  directory character varying COLLATE pg_catalog."default" NOT NULL,
  provider character varying COLLATE pg_catalog."default" NOT NULL
);

ALTER TABLE IF EXISTS public."archived-videos"
  OWNER to videos;
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
DROP TABLE IF EXISTS public."archived-videos";
      `
    );
  }

}

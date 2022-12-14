import {MigrationInterface, QueryRunner} from "typeorm";

export class IndexFkPk1643076703759 implements MigrationInterface {
    name = 'IndexFkPk1643076703759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "archived-videos" ADD "channelId" integer`);
        await queryRunner.query(`ALTER TABLE "archived-channels" ADD "recommendations" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "archived-videos" ADD CONSTRAINT "PK_aff1791f52916e5406884cf3b08" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "archived-channels" ADD CONSTRAINT "PK_7c2269b1a71fec8710837dea049" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE INDEX "IDX_3223ab3c513fae17eab834506a" ON "archived-channels" ("name") `);
        await queryRunner.query(`ALTER TABLE "archived-videos" ADD CONSTRAINT "FK_7c67f57f6b5720b3206efe4e7b4" FOREIGN KEY ("channelId") REFERENCES "archived-channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "archived-videos" DROP CONSTRAINT "FK_7c67f57f6b5720b3206efe4e7b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3223ab3c513fae17eab834506a"`);
        await queryRunner.query(`ALTER TABLE "archived-channels" DROP CONSTRAINT "PK_7c2269b1a71fec8710837dea049"`);
        await queryRunner.query(`ALTER TABLE "archived-videos" DROP CONSTRAINT "PK_aff1791f52916e5406884cf3b08"`);
        await queryRunner.query(`ALTER TABLE "archived-channels" DROP COLUMN "recommendations"`);
        await queryRunner.query(`ALTER TABLE "archived-videos" DROP COLUMN "channelId"`);
    }

}

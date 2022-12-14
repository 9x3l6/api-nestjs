import {MigrationInterface, QueryRunner} from "typeorm";

export class User1643120734027 implements MigrationInterface {
    name = 'User1643120734027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "provider" character varying NOT NULL, "first" character varying NOT NULL, "last" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "resetPasswordToken" character varying NOT NULL, "emailConfirmationToken" character varying NOT NULL, "phoneConfirmationToken" character varying NOT NULL, "emailConfirmed" boolean NOT NULL, "phoneConfirmed" boolean NOT NULL, "blocked" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

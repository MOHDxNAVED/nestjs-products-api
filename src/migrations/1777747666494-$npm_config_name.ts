import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1777747666494 implements MigrationInterface {
    name = ' $npmConfigName1777747666494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "image"`);
    }

}

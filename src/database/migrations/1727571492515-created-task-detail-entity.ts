import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedTaskDetailEntity1727571492515 implements MigrationInterface {
    name = 'CreatedTaskDetailEntity1727571492515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`weight\` int NOT NULL, \`ingredient_id\` int NULL, \`task_id\` int NULL, UNIQUE INDEX \`REL_c972242fe1a104fb445d6cd69e\` (\`ingredient_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD CONSTRAINT \`FK_c972242fe1a104fb445d6cd69ea\` FOREIGN KEY (\`ingredient_id\`) REFERENCES \`ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD CONSTRAINT \`FK_8dd105cc331cd48cf857d822ab2\` FOREIGN KEY (\`task_id\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP FOREIGN KEY \`FK_8dd105cc331cd48cf857d822ab2\``);
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP FOREIGN KEY \`FK_c972242fe1a104fb445d6cd69ea\``);
        await queryRunner.query(`DROP INDEX \`REL_c972242fe1a104fb445d6cd69e\` ON \`task_detail\``);
        await queryRunner.query(`DROP TABLE \`task_detail\``);
    }

}

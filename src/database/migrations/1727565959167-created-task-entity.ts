import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedTaskEntity1727565959167 implements MigrationInterface {
  name = 'CreatedTaskEntity1727565959167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL, \`production_batch\` varchar(255) NOT NULL, \`start_date\` timestamp NULL, \`end_date\` timestamp NULL, \`unit\` varchar(255) NOT NULL, \`repetition\` int NOT NULL, \`multiplicity\` int NOT NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD CONSTRAINT \`FK_8a453a6c5f9205e83c025240136\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_8a453a6c5f9205e83c025240136\``,
    );
    await queryRunner.query(`DROP TABLE \`task\``);
  }
}

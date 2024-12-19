import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldItemid1730300123503 implements MigrationInterface {
    name = 'AddFieldItemid1730300123503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD \`item_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_fb0b5b8bc408db666a8bf407661\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_2553dadf75310d9280d7d68e07f\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP COLUMN \`cuantity\``);
        await queryRunner.query(`ALTER TABLE \`items\` ADD \`cuantity\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`product_id\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`ingredient_id\` \`ingredient_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP FOREIGN KEY \`FK_c972242fe1a104fb445d6cd69ea\``);
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP FOREIGN KEY \`FK_8dd105cc331cd48cf857d822ab2\``);
        await queryRunner.query(`ALTER TABLE \`task_detail\` CHANGE \`ingredient_id\` \`ingredient_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` CHANGE \`task_id\` \`task_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_8a453a6c5f9205e83c025240136\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`start_date\` \`start_date\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`end_date\` \`end_date\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`productId\` \`productId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_fb0b5b8bc408db666a8bf407661\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_2553dadf75310d9280d7d68e07f\` FOREIGN KEY (\`ingredient_id\`) REFERENCES \`ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD CONSTRAINT \`FK_c972242fe1a104fb445d6cd69ea\` FOREIGN KEY (\`ingredient_id\`) REFERENCES \`ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD CONSTRAINT \`FK_8dd105cc331cd48cf857d822ab2\` FOREIGN KEY (\`task_id\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_8a453a6c5f9205e83c025240136\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_8a453a6c5f9205e83c025240136\``);
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP FOREIGN KEY \`FK_8dd105cc331cd48cf857d822ab2\``);
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP FOREIGN KEY \`FK_c972242fe1a104fb445d6cd69ea\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_2553dadf75310d9280d7d68e07f\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_fb0b5b8bc408db666a8bf407661\``);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`productId\` \`productId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`end_date\` \`end_date\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`start_date\` \`start_date\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_8a453a6c5f9205e83c025240136\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` CHANGE \`task_id\` \`task_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` CHANGE \`ingredient_id\` \`ingredient_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD CONSTRAINT \`FK_8dd105cc331cd48cf857d822ab2\` FOREIGN KEY (\`task_id\`) REFERENCES \`task\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` ADD CONSTRAINT \`FK_c972242fe1a104fb445d6cd69ea\` FOREIGN KEY (\`ingredient_id\`) REFERENCES \`ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`ingredient_id\` \`ingredient_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`items\` CHANGE \`product_id\` \`product_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`items\` DROP COLUMN \`cuantity\``);
        await queryRunner.query(`ALTER TABLE \`items\` ADD \`cuantity\` varchar(20) NOT NULL DEFAULT ''0''`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_2553dadf75310d9280d7d68e07f\` FOREIGN KEY (\`ingredient_id\`) REFERENCES \`ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_fb0b5b8bc408db666a8bf407661\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task_detail\` DROP COLUMN \`item_id\``);
    }

}

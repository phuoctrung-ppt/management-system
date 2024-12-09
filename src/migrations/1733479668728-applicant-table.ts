import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ApplicantTable1733479668728 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'applicants',
            columns: [
              { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
              { name: 'email', type: 'varchar', length: '50', isUnique: true },
              { name: 'phone_number', type: 'varchar', length: '50' },
              { name: 'status', type: 'enum', enum: ['APPLIED', 'INVITED', 'REJECTED', 'HIRED', 'NONE'], default: `'NONE'` },
              { name: 'resume', type: 'text' },
              { name: 'submitted_at', type: 'date' },
              { name: 'job_id', type: 'uuid' },
              { name: 'created_at', type: 'timestamp', default: 'now()' },
              { name: 'updated_at', type: 'timestamp', default: 'now()' },
            ],
          }),
        );
    
        await queryRunner.createForeignKey(
          'applicants',
          new TableForeignKey({
            columnNames: ['job_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'jobs',
            onDelete: 'CASCADE',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('applicants');
      }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class JobTable1733479624770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'title', type: 'varchar', length: '255' },
          { name: 'number_of_vacancies', type: 'smallint', isNullable: true },
          {
            name: 'experience',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          { name: 'requirements', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'location', type: 'varchar', length: '255' },
          {
            name: 'job_type',
            type: 'enum',
            enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
            default: `'FULL_TIME'`,
          },
          { name: 'salary_range', type: 'varchar', length: '100' },
          {
            name: 'status',
            type: 'enum',
            enum: ['OPEN', 'CLOSED'],
            default: `'OPEN'`,
          },
          { name: 'created_by', type: 'uuid' },
          { name: 'ended_date', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'jobs',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class JobTable1733479624770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            enum: ['Fulltime', 'Partime', 'Internship'],
            default: `'Fulltime'`,
          },
          { name: 'salary_range', type: 'varchar', length: '100' },
          {
            name: 'status',
            type: 'enum',
            enum: ['OPEN', 'CLOSED'],
            default: `'OPEN'`,
          },
          { name: 'created_by', type: 'varchar', length: '255' },
          { name: 'ended_date', type: 'timestamp' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
  }
}

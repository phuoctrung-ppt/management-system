import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InterviewTable1733479736513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'interviews',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'location', type: 'varchar', length: '50' },
          { name: 'date_time', type: 'timestamp' },
          {
            name: 'status',
            type: 'enum',
            enum: ['available', 'blocked'],
            default: `'available'`,
          },
          { name: 'note', type: 'text', isNullable: true },
          { name: 'applicant_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'interviews',
      new TableForeignKey({
        columnNames: ['applicant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'applicants',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('interviews');
  }
}

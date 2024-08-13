import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('academic')
export class AcademicEntities {
  @PrimaryGeneratedColumn('increment', {
    name: 'academic_id',
  })
  academicId: number;

  @Column()
  institutionName: string;

  @Column()
  passingYear: number;

  @Column()
  qualification: string;

  @Column()
  university: string;

  @Column('decimal', { precision: 5, scale: 2 })
  percentage: number;

  @Column()
  userId: number;
}


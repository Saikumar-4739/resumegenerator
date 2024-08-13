import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PersonalDetails')
export default class PersonalDetailsEntities {
  @PrimaryGeneratedColumn('increment', { name: 'details_id' })
  detailsId: number;

  @Column()
  userId: number;

  @Column()
  fatherName: string;

  @Column()
  motherName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  maritalStatus: string;

  @Column('simple-array')
  languagesKnown: string[];
}

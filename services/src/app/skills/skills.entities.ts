import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('skill')
export class SkillEntities {
  @PrimaryGeneratedColumn('increment', { name: 'skill_id' })
  skillId: number;

  @Column()
  skillName: string;

  @Column()
  department: string;

  @Column()
  userId: number;
}

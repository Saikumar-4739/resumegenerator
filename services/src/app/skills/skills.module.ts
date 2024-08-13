import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillService } from './skills.services';
import { SkillController } from './skills.controller';
import { SkillEntities } from './skills.entities';

@Module({
  imports: [TypeOrmModule.forFeature([SkillEntities])],
  providers: [SkillService],
  controllers: [SkillController],
})
export class SkillModule {}

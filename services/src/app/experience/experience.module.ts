import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceService } from './experience.services';
import { ExperienceController } from './experience.controller';
import { UserRepo } from '../user/userrepo/user.repo';
import { Experienceentities } from './experience.entities';


@Module({
  imports: [TypeOrmModule.forFeature([Experienceentities, UserRepo])],
  providers: [ExperienceService, UserRepo],
  controllers: [ExperienceController],
})
export class ExperienceModule {}

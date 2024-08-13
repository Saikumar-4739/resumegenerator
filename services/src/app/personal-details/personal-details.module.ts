import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalDetailsService } from './personal-details.services';
import { PersonalDetailsController } from './personal-details.controller';
import PersonalDetailsEntities from './personal-details.entities';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalDetailsEntities])],
  providers: [PersonalDetailsService],
  controllers: [PersonalDetailsController],
})
export class PersonalDetailsModule {}

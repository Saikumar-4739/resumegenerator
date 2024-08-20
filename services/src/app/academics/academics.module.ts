import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicService } from './academics.services';
import { AcademicController } from './academics.controller';
import { AcademicEntities } from './academics.entities';



@Module({
  imports: [TypeOrmModule.forFeature([AcademicEntities])],
  providers: [AcademicService],
  controllers: [AcademicController],
  exports: [AcademicService]
})
export class AcademicModule {}

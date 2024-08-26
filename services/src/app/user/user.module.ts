import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.services';
import { UserController } from './user.controller';
import { UserRepo } from './userrepo/user.repo';
import { UserEntity } from './user.entities';
import { AddressEntities } from '../address/address.entities';
import { AddressModule } from '../address/address.module';
import { AddressRepo } from '../address/models/address.repo';
import { ExperienceModule } from '../experience/experience.module';
import { AcademicModule } from '../academics/academics.module';
import { SkillModule } from '../skills/skills.module';
import { PersonalDetailsModule } from '../personal-details/personal-details.module';
import { ImageModule } from '../image/image.module';
import { ImageService } from '../image/image.services';
import {Image} from "../image/image.entities";



@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AddressEntities, Image]),
    AddressModule,
    ExperienceModule,
    AcademicModule,
    SkillModule,
    PersonalDetailsModule,
    ImageModule,
  ],
  providers: [UserService,  UserRepo, AddressRepo, ImageService],
  controllers: [UserController],
})
export class UserModule {} 

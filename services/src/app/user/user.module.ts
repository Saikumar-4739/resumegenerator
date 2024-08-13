import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.services';
import { UserController } from './user.controller';
import { UserRepo } from './userrepo/user.repo';
import { UserEntity } from './user.entities';
import { AddressEntities } from '../address/address.entities';
import { AddressModule } from '../address/address.module';
import { AddressRepo } from '../address/models/address.repo';



@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AddressEntities]),
    AddressModule
  ],
  providers: [UserService,  UserRepo, AddressRepo],
  controllers: [UserController],
})
export class UserModule {} 

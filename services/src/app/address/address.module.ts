import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.services';
import { AddressRepo } from './models/address.repo';
import { AddressEntities } from './address.entities';



@Module({
  imports: [
    TypeOrmModule.forFeature([AddressEntities])
  ],
  providers: [AddressService, AddressRepo],
  exports: [AddressService]
})
export class AddressModule {} 

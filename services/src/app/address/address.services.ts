import { Injectable } from '@nestjs/common';
import { addressIdRequest } from './models/address.id-request';
import { AddressModel } from './models/address.model';
import { AddressRepo } from './models/address.repo';
import { AddressResponse } from './models/address.response';
import { AddressEntities } from './address.entities';




@Injectable()
export class AddressService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findOne(arg0: { where: { userId: number; }; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly addressRepository: AddressRepo) {}

  async createAddress(addressModel: AddressModel): Promise<AddressResponse> {

    const addressEnt = new AddressEntities();
    addressEnt.userId = addressModel.userid;
    addressEnt.street = addressModel.street;
    addressEnt.state = addressModel.state;
    addressEnt.city = addressModel.city;
    addressEnt.country = addressModel.country;
    addressEnt.zipcode = addressModel.zipcode;

    const savedAddress = await this.addressRepository.save(addressEnt);

    return {
      status: true,
      internalMessage: 'Address saved successfully',
      data: [savedAddress],
      errorCode: 0,
    };
  }

  async getAddress(req: addressIdRequest): Promise<AddressModel[]> {
    const addressIds = req.addressId;
    const address = await this.addressRepository.findByIds(addressIds);
    if (!address || address.length === 0) {
      return [];
    }
    return address;
  }

  async getAddressOfUserId(userId: number): Promise<AddressModel> {
    const address = await this.addressRepository.findOne({
      where: { userId: userId },
    });
    const addr = new AddressModel();
    addr.street = address.street;
    addr.city = address.city;
    addr.state = address.state;
    addr.country = address.country;
    addr.zipcode = address.zipcode;
    return addr;
  }

  async updateAddress(req: AddressModel): Promise<AddressResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { addressId, ...addressDetails } = req;
    const address = await this.addressRepository.findOne({
      where: { addressId: req.addressId },
    });

    if (!address) {
      return {
        status: false,
        internalMessage: 'Address not found',
        data: [],
        errorCode: 2,
      };
    }

    Object.assign(address, addressDetails);
    const updatedAddress = await this.addressRepository.save(address);

    return {
      status: true,
      internalMessage: 'Address updated successfully',
      data: [updatedAddress],
      errorCode: 0,
    };
  }

  async deleteAddress(req: addressIdRequest): Promise<AddressResponse> {
    const addressIds = req.addressId;
    await this.addressRepository.delete(addressIds);

    return {
      status: true,
      internalMessage: 'Address deleted successfully',
      data: null,
      errorCode: 0,
    };
  }
}

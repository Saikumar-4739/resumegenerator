import { AddressModel } from "./address.model";


export interface AddressResponse {
  status: boolean;
  internalMessage: string;
  data: AddressModel[];
  errorCode: number;
}

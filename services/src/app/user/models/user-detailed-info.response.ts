import UserDetailedInfoModel from './user-detailed-info.model';

export class UserDetailedInfoResponse {
  status: boolean;
  internalMessage: string;
  data: UserDetailedInfoModel[];
  errorCode: number;
}

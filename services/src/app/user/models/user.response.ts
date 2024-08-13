import { UserModel } from "./user.model";

export interface UserResponse {
  status: boolean;
  internalMessage: string;
  data: UserModel[] | null;
  errorCode: number;
}

import { PersonalDetailsModel } from "./personal-details.model";

export class PersonalDetailsResponse {
  status: boolean;
  internalMessage: string;
  data: PersonalDetailsModel[] | null;
  errorCode: number;
}


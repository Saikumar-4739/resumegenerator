import { ExperienceModel } from "./exp.model";
import { ExperienceResponseModel } from "./expe.responsemodel";

export class ExperienceResponse {
    status: boolean;
    internalMessage: string;
    data: ExperienceModel[] | ExperienceResponseModel[] |null;
    errorCode: number;
  }
  

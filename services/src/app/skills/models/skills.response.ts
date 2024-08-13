import { SkillModel } from "./skills.model";

export class SkillResponse {
    status: boolean;
    internalMessage: string;
    data: SkillModel[] | null;
    errorCode: number;
  }
  

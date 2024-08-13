import { AcademicModel } from "./academics.model";

export class AcademicResponse {
  status: boolean;
  internalMessage: string;
  data: AcademicModel [ ] | null;
  errorCode: number;
}

import { IsNumber } from 'class-validator';

export class ExperienceIdRequest {
  @IsNumber({}, { each: true })
  experienceId: number[];
}


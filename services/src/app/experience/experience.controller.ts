import { Controller, Post, Body, Param } from '@nestjs/common';
import { ExperienceService } from './experience.services';
import { ExperienceCreateRequest } from './models/exp.createrequest';
import { ExperienceResponse } from './models/exp.response';
import { ExperienceIdRequest } from './models/exp-id.request';


@Controller('experiences')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post('/createExp')
  async createExperience(@Body() experienceData: ExperienceCreateRequest): Promise<ExperienceResponse> {
    return this.experienceService.createExperience(experienceData);
  }

  @Post('/deleteByIds')
  async deleteExperiencesByIds(@Body() req: ExperienceIdRequest): Promise<ExperienceResponse> {
    return this.experienceService.deleteExperiencesByIds(req);
  }

  @Post('/update/:userId')
  async updateExperience(@Body() experienceData: ExperienceCreateRequest & { experienceId: number }): Promise<ExperienceResponse> {
    return this.experienceService.updateExperience(experienceData);
  }

  @Post('/getExperiencesByIds')
  async getExperiencesByIds(@Body() req: ExperienceIdRequest): Promise<ExperienceResponse> {
    return this.experienceService.getExperiencesByIds(req);
  }

  @Post(':userId')
  async getExpByUserId(@Param('userId') userId: number): Promise<ExperienceResponse> {
    return this.experienceService.getExpByUserId(userId);
}
}

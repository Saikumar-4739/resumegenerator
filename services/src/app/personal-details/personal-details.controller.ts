import { Controller, Post, Body, Param } from '@nestjs/common';
import { PersonalDetailsService } from './personal-details.services';
import { PersonalDetailsCreateRequest } from './models/personal-details-create.req';
import { PersonalDetailsResponse } from './models/personal-details.response';




@Controller('personal-details')
export class PersonalDetailsController {
  constructor(private readonly personalDetailsService: PersonalDetailsService) {}

  @Post('create')
  async createPersonalDetails(
    @Body() personalDetailsCreateRequest: PersonalDetailsCreateRequest
  ): Promise<PersonalDetailsResponse> {
    return await this.personalDetailsService.createPersonalDetails(personalDetailsCreateRequest);
  }

  @Post('update/:detailsId')
  async updatePersonalDetails(
    @Param('detailsId') detailsId: number,
    @Body() personalDetailsCreateRequest: PersonalDetailsCreateRequest
  ): Promise<PersonalDetailsResponse> {
    return await this.personalDetailsService.updatePersonalDetails(detailsId, personalDetailsCreateRequest);
  }

  @Post('delete/:detailsId')
  async deletePersonalDetails(
    @Param('detailsId') detailsId: number
  ): Promise<PersonalDetailsResponse> {
    return await this.personalDetailsService.deletePersonalDetails(detailsId);
  }

  @Post('get/:detailsId')
  async getPersonalDetailsById(
    @Param('detailsId') detailsId: number
  ): Promise<PersonalDetailsResponse> {
    return await this.personalDetailsService.getPersonalDetailsById(detailsId);
  }

  @Post(':userId')
  async getPersonalDetailsByUserId(@Param('userId') userId: number): Promise<PersonalDetailsResponse> {
    return this.personalDetailsService.getPersonalDetailsByUserId(userId);
}
}

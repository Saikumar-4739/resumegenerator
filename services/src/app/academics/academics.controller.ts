import { Controller, Post, Body,Param } from '@nestjs/common';
import { AcademicService } from './academics.services';
import { AcademicCreateRequest } from './models/academics.create-req';
import { AcademicIdRequest } from './models/academics.id-req';
import { AcademicResponse } from './models/academics.response';


@Controller('academics')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Post('/create')
  async createAcademic(@Body() academicData: AcademicCreateRequest): Promise<AcademicResponse> {
    return this.academicService.createAcademic(academicData);
  }

  @Post('/getByIds')
  async getAcademicsByIds(@Body() req: AcademicIdRequest): Promise<AcademicResponse> {
    return this.academicService.getAcademicsByIds(req);
  }

  @Post('/deleteByIds')
  async deleteAcademicsByIds(@Body() req: AcademicIdRequest): Promise<AcademicResponse> {
    return this.academicService.deleteAcademicsByIds(req);
  }

  @Post('/update')
  async updateAcademic(@Body() academicData: AcademicCreateRequest & { academicId: number }): Promise<AcademicResponse> {
    return this.academicService.updateAcademic(academicData);
  }

  @Post(':userId')
  async getAcademicsByUserId(@Param('userId') userId: number): Promise<AcademicResponse> {
    return this.academicService.getAcademicsByUserId(userId);
}
}

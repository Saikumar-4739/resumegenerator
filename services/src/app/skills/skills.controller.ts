import { Controller, Post, Body, Param } from '@nestjs/common';
import { SkillService } from './skills.services';
import { SkillCreateRequest } from './models/skills.create-request';
import { SkillResponse } from './models/skills.response';


@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('/createSkill')
  async createSkill(@Body() skillData: SkillCreateRequest): Promise<SkillResponse> {
    return this.skillService.createSkill(skillData);
  }

  @Post('/update/:userId')
  async updateSkill(@Body() skillData: SkillCreateRequest & { skillId: number }): Promise<SkillResponse> {
    return this.skillService.updateSkill(skillData.skillId, skillData);
  }

  @Post('/delete/:userId')
  async deleteSkill(@Body() skillData: { skillId: number }): Promise<SkillResponse> {
    return this.skillService.deleteSkill(skillData.skillId);
  }

  @Post('/getSkillById')
  async getSkillById(@Body() skillData: { skillId: number }): Promise<SkillResponse> {
    return this.skillService.getSkillById(skillData.skillId);
  }

  @Post(':userId')
  async getSkillsByUserId(@Param('userId') userId: number): Promise<SkillResponse> {
    return this.skillService.getSkillsByUserId(userId);
}
}

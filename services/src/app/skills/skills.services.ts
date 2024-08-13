/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntities } from './skills.entities';
import { SkillCreateRequest } from './models/skills.create-request';
import { SkillResponse } from './models/skills.response';
import { SkillModel } from './models/skills.model';



@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntities) private skillRepo: Repository<SkillEntities>,
  ) {}

  // Create Skill
  async createSkill(skillData: SkillCreateRequest): Promise<SkillResponse> {
    if (!skillData || !skillData.skillName) {
      return {
        status: false,
        internalMessage: 'Invalid skill data',
        data: null,
        errorCode: 2,
      };
    }
  
    const existingSkill = await this.skillRepo.findOne({
      where: { skillName: skillData.skillName },
    });
    
    const newSkill = this.skillRepo.create({
      ...skillData,
      // Ensure skillId is not set manually or undefined
    });
  
    try {
      const savedSkill = await this.skillRepo.save(newSkill);
  
      const skillModel: SkillModel = {
        skillId: savedSkill.skillId,
        skillName: savedSkill.skillName,
        department: savedSkill.department,
      };
  
      return {
        status: true,
        internalMessage: 'Skill created successfully',
        data: [skillModel],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error creating skill:', error); // Log the error for debugging
      return {
        status: false,
        internalMessage: 'Failed to create skill',
        data: null,
        errorCode: 1,
      };
    }
  }
  
  async updateSkill(skillId: number, skillData: SkillCreateRequest): Promise<SkillResponse> {
    const skillToUpdate = await this.skillRepo.findOne({ where: { skillId } });

    if (!skillToUpdate) {
      return {
        status: false,
        internalMessage: 'Skill not found',
        data: null,
        errorCode: 2,
      };
    }

    Object.assign(skillToUpdate, skillData);

    try {
      const updatedSkill = await this.skillRepo.save(skillToUpdate);
      const skillModel: SkillModel = {
        skillId: updatedSkill.skillId,
        skillName: updatedSkill.skillName,
        department: updatedSkill.department,
      };

      return {
        status: true,
        internalMessage: 'Skill updated successfully',
        data: [skillModel],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error updating skill:', error); // Log the error for debugging
      return {
        status: false,
        internalMessage: 'Failed to update skill',
        data: null,
        errorCode: 1,
      };
    }
}

  // Delete Skill
  async deleteSkill(skillId: number): Promise<SkillResponse> {
    try {
      const deleteResult = await this.skillRepo.delete(skillId);

      if (deleteResult.affected === 0) {
        return {
          status: false,
          internalMessage: 'Skill not found',
          data: null,
          errorCode: 2,
        };
      }

      return {
        status: true,
        internalMessage: 'Skill deleted successfully',
        data: null,
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to delete skill',
        data: null,
        errorCode: 1,
      };
    }
  }

  // Get All Skills
  async getAllSkills(): Promise<SkillResponse> {
    try {
      const skills = await this.skillRepo.find();
      const skillModels: SkillModel[] = skills.map(skill => ({
        skillId: skill.skillId,
        skillName: skill.skillName,
        department: skill.department,
      }));

      return {
        status: true,
        internalMessage: 'Skills retrieved successfully',
        data: skillModels,
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to retrieve skills',
        data: null,
        errorCode: 1,
      };
    }
  }

  // Get Skill by ID
  async getSkillById(skillId: number): Promise<SkillResponse> {
    try {
      const skill = await this.skillRepo.findOne({ where: { skillId } });
      
      if (!skill) {
        return {
          status: false,
          internalMessage: 'Skill not found',
          data: null,
          errorCode: 2,
        };
      }
      
      const skillModel: SkillModel = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        department: skill.department,
      };
      
      return {
        status: true,
        internalMessage: 'Skill retrieved successfully',
        data: [skillModel],
        errorCode: 0,
      };
    } catch (error) {
      // Log the actual error details for debugging
      console.error('Error retrieving skill:', error);
      return {
        status: false,
        internalMessage: 'Failed to retrieve skill',
        data: null,
        errorCode: 1,
      };
    }
  }

  async getSkillsByUserId(userId: number): Promise<SkillResponse> {
    try {
      const skills = await this.skillRepo.find({ where: { userId } });
      
      if (!skills.length) {
        return {
          status: false,
          internalMessage: 'No skills found for the user',
          data: [],
          errorCode: 404,
        };
      }
      
      const skillModels: SkillModel[] = skills.map(skill => ({
        skillId: skill.skillId,
        skillName: skill.skillName,
        department: skill.department,
      }));
      
      return {
        status: true,
        internalMessage: 'Skills retrieved successfully',
        data: skillModels,
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error retrieving skills by user ID:', error);
      return {
        status: false,
        internalMessage: 'Failed to retrieve skills',
        data: null,
        errorCode: 1,
      };
    }
  }
  
}

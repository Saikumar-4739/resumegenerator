import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExperienceCreateRequest } from './models/exp.createrequest';
import { Experienceentities } from './experience.entities';
import { UserRepo } from '../user/userrepo/user.repo';
import { ExperienceResponse } from './models/exp.response';
import { ExperienceModel } from './models/exp.model';
import { ExperienceIdRequest } from './models/exp-id.request';




@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experienceentities) private experienceRepo: Repository<Experienceentities>,
    private userRepo: UserRepo
  ) {}

  async createExperience(experienceData: ExperienceCreateRequest): Promise<ExperienceResponse> {
    const newExperience = this.experienceRepo.create(experienceData);
    try {
      const savedExperience = await this.experienceRepo.save(newExperience);
      const experienceModel: ExperienceModel = {
        experienceId: savedExperience.experienceId,
        objective: savedExperience.objective,
        companyName: savedExperience.companyName,
        role: savedExperience.role,
        fromYear: savedExperience.fromYear,
        toYear: savedExperience.toYear,
        description: savedExperience.description
      };
      return {
        status: true,
        internalMessage: 'Experience created successfully',
        data: [experienceModel],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Failed to create experience:', error);
      return {
        status: false,
        internalMessage: 'Failed to create experience',
        data: null,
        errorCode: 1,
      };
    }
  }

  async getExperiencesByIds(req: ExperienceIdRequest): Promise<ExperienceResponse> {
    try {
      // Validate request
      if (!req.experienceId || !Array.isArray(req.experienceId)) {
        return {
          status: false,
          internalMessage: 'Invalid experience IDs provided',
          data: [],
          errorCode: 1,
        };
      }

      // Fetch experiences
      const experiences = await this.experienceRepo.findByIds(req.experienceId);
      if (!experiences.length) {
        return {
          status: false,
          internalMessage: 'No experiences found for the provided IDs',
          data: [],
          errorCode: 1,
        };
      }

      // Map experiences to desired format
      const experienceModels: ExperienceModel[] = experiences.map(experience => ({
       experienceId: experience.experienceId,
        objective: experience.objective,
        companyName: experience.companyName,
        role: experience.role,
        fromYear: experience.fromYear,
        toYear: experience.toYear,
        description: experience.description,
      }));

      return {
        status: true,
        internalMessage: 'Experiences retrieved successfully',
        data: experienceModels,
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error retrieving experiences:', error);
      return {
        status: false,
        internalMessage: 'Error retrieving experiences',
        data: [],
        errorCode: 2,
      };
    }
}


  async deleteExperiencesByIds(req: ExperienceIdRequest): Promise<ExperienceResponse> {
    try {
      await this.experienceRepo.delete(req.experienceId);
      return {
        status: true,
        internalMessage: 'Experiences deleted successfully',
        data: [],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Failed to delete experiences:', error);
      return {
        status: false,
        internalMessage: 'Failed to delete experiences',
        data: [],
        errorCode: 1,
      };
    }
  }

  async updateExperience(experienceData: ExperienceCreateRequest & { experienceId: number }): Promise<ExperienceResponse> {
    try {
      const experience = await this.experienceRepo.findOneBy({ experienceId: experienceData.experienceId });
      if (!experience) {
        return {
          status: false,
          internalMessage: 'Experience not found',
          data: [],
          errorCode: 1,
        };
      }
      Object.assign(experience, experienceData);
      const updatedExperience = await this.experienceRepo.save(experience);
      const experienceModel: ExperienceModel = {
        experienceId: updatedExperience.experienceId,
        objective: updatedExperience.objective,
        companyName: updatedExperience.companyName,
        role: updatedExperience.role,
        fromYear: updatedExperience.fromYear,
        toYear: updatedExperience.toYear,
        description: updatedExperience.description,
      };
      return {
        status: true,
        internalMessage: 'Experience updated successfully',
        data: [experienceModel],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Failed to update experience:', error);
      return {
        status: false,
        internalMessage: 'Failed to update experience',
        data: [],
        errorCode: 2,
      };
    }
  }



  async getExpByUserId(userId: number): Promise<ExperienceResponse> {
    try {
      console.log(`Fetching experiences for user ID: ${userId}`);
  
      const user = await this.userRepo.getUsers([userId]);
  
      if (!user) {
        return {
          status: false,
          internalMessage: 'User not found',
          data: null,
          errorCode: 404,
        };
      }
  
      const experiences = await this.experienceRepo.find({ where: { userId: userId } });
      
      console.log(`found the user id : ${experiences}`);
  
      if (!experiences.length) {
        return {
          status: false,
          internalMessage: 'No experiences found for the user',
          data: [],
          errorCode: 404,
        };
      } 
  
      const experienceModels: ExperienceModel[] = experiences.map(experience => ({
        experienceId: experience.experienceId,
        objective: experience.objective,
        companyName: experience.companyName,
        role: experience.role,
        fromYear: experience.fromYear,
        toYear: experience.toYear,
        description: experience.description,
      }));
  
      return {
        status: true,
        internalMessage: 'Experiences retrieved successfully',
        data: experienceModels,
        errorCode: 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching experiences by user ID:', error.message);
        console.error(error.stack);
      } else {
        console.error('An unexpected error occurred:', error);
      }
  
      return {
        status: false,
        internalMessage: 'An error occurred while retrieving the experiences',
        data: null,
        errorCode: 500,
      };
    }
  }
}
  

  

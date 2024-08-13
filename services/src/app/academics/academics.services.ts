import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicEntities } from './academics.entities';
import { AcademicResponse } from './models/academics.response';
import { AcademicModel } from './models/academics.model';
import { AcademicCreateRequest } from './models/academics.create-req';
import { AcademicIdRequest } from './models/academics.id-req';




@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(AcademicEntities) private academicRepo: Repository<AcademicEntities>,
  ) {}

  async createAcademic(academicData: AcademicCreateRequest): Promise<AcademicResponse> {
    const newAcademic = this.academicRepo.create(academicData);

    try {
      const savedAcademic = await this.academicRepo.save(newAcademic);
      const academicModel: AcademicModel = {
        academicId: savedAcademic.academicId,
        institutionName: savedAcademic.institutionName,
        passingYear: savedAcademic.passingYear,
        qualification: savedAcademic.qualification,
        university: savedAcademic.university,
        percentage: savedAcademic.percentage,
      };

      return {
        status: true,
        internalMessage: 'Academic record created successfully',
        data: [academicModel], 
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to create academic record',
        data: null,
        errorCode: 1,
      };
    }
  }

  async getAcademicsByIds(req: AcademicIdRequest): Promise<AcademicResponse> {
    try {
   
      if (!Array.isArray(req.academicId) || req.academicId.length === 0) {
        return {
          status: false,
          internalMessage: 'Invalid or empty academicId array',
          data: null,
          errorCode: 1,
        };
      }

    
      const academics = await this.academicRepo.find({
        where: {
          academicId: In(req.academicId),
        },
      });

      if (academics.length === 0) {
        return {
          status: false,
          internalMessage: 'No academic records found for the provided IDs',
          data: null,
          errorCode: 1,
        };
      }

    
      const academicModels: AcademicModel[] = academics.map(academic => ({
        academicId: academic.academicId,
        institutionName: academic.institutionName,
        passingYear: academic.passingYear,
        qualification: academic.qualification,
        university: academic.university,
        percentage: academic.percentage,
      }));

      return {
        status: true,
        internalMessage: 'Academic records retrieved successfully',
        data: academicModels,
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error retrieving academic records:', error);
      return {
        status: false,
        internalMessage: 'Error retrieving academic records',
        data: null,
        errorCode: 2,
      };
    }
  }

  async deleteAcademicsByIds(req: AcademicIdRequest): Promise<AcademicResponse> {
    try {
      await this.academicRepo.delete(req.academicId);
      return {
        status: true,
        internalMessage: 'Academic records deleted successfully',
        data: null,
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to delete academic records',
        data: null,
        errorCode: 1,
      };
    }
  }

  async updateAcademic(academicData: AcademicCreateRequest & { academicId: number }): Promise<AcademicResponse> {
    try {
      const academic = await this.academicRepo.findOneBy({ academicId: academicData.academicId });

      if (!academic) {
        return {
          status: false,
          internalMessage: 'Academic record not found',
          data: null,
          errorCode: 1,
        };
      }

      Object.assign(academic, academicData);
      const updatedAcademic = await this.academicRepo.save(academic);

      const academicModel: AcademicModel = {
        academicId: updatedAcademic.academicId,
        institutionName: updatedAcademic.institutionName,
        passingYear: updatedAcademic.passingYear,
        qualification: updatedAcademic.qualification,
        university: updatedAcademic.university,
        percentage: updatedAcademic.percentage,
      };

      return {
        status: true,
        internalMessage: 'Academic record updated successfully',
        data: [academicModel],  // Adjusted to single item
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to update academic record',
        data: null,
        errorCode: 2,
      };
    }
  }

  async getAcademicsByUserId(userId: number): Promise<AcademicResponse> {
    try {
      console.log(`Fetching academic records for user ID: ${userId}`);

      const academics = await this.academicRepo.find({ where: { userId: userId } });

      if (academics.length === 0) {
        return {
          status: false,
          internalMessage: 'No academic records found for the user',
          data: [],
          errorCode: 404,
        };
      }

      const academicModels: AcademicModel[] = academics.map(academic => ({
        academicId: academic.academicId,
        institutionName: academic.institutionName,
        passingYear: academic.passingYear,
        qualification: academic.qualification,
        university: academic.university,
        percentage: academic.percentage,
      }));

      return {
        status: true,
        internalMessage: 'Academic records retrieved successfully',
        data: academicModels,
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error fetching academic records by user ID:', error);
      return {
        status: false,
        internalMessage: 'An error occurred while retrieving the academic records',
        data: null,
        errorCode: 500,
      };
    }
  }
}


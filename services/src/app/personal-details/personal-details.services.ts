import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PersonalDetails from './personal-details.entities';
import { PersonalDetailsCreateRequest } from './models/personal-details-create.req';
import { PersonalDetailsResponse } from './models/personal-details.response';
import { PersonalDetailsModel } from './models/personal-details.model';




@Injectable()
export class PersonalDetailsService {
  constructor(
    @InjectRepository(PersonalDetails) private personalDetailsRepo: Repository<PersonalDetails>,
  ) {}


  async createPersonalDetails(detailsData: PersonalDetailsCreateRequest): Promise<PersonalDetailsResponse> {
    if (!detailsData || !detailsData.fatherName || !detailsData.motherName) {
      return {
        status: false,
        internalMessage: 'Invalid personal details data',
        data: null,
        errorCode: 2,
      };
    }

    const newPersonalDetails = this.personalDetailsRepo.create({
      ...detailsData,
    });

    try {
      const savedPersonalDetails = await this.personalDetailsRepo.save(newPersonalDetails);

      const personalDetailsModel: PersonalDetailsModel = {
        detailsId: savedPersonalDetails.detailsId,
        userId: savedPersonalDetails.userId,
        fatherName: savedPersonalDetails.fatherName,
        motherName: savedPersonalDetails.motherName,
        dateOfBirth: savedPersonalDetails.dateOfBirth,
        maritalStatus: savedPersonalDetails.maritalStatus,
        languagesKnown: savedPersonalDetails.languagesKnown,
      };

      return {
        status: true,
        internalMessage: 'Personal details created successfully',
        data: [personalDetailsModel],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error creating personal details:', error); // Log the error for debugging
      return {
        status: false,
        internalMessage: 'Failed to create personal details',
        data: null,
        errorCode: 1,
      };
    }
  }

  
  async updatePersonalDetails(detailsId: number, detailsData: PersonalDetailsCreateRequest): Promise<PersonalDetailsResponse> {
    const detailsToUpdate = await this.personalDetailsRepo.findOne({ where: { detailsId } });

    if (!detailsToUpdate) {
      return {
        status: false,
        internalMessage: 'Personal details not found',
        data: null,
        errorCode: 2,
      };
    }

    Object.assign(detailsToUpdate, detailsData);

    try {
      const updatedPersonalDetails = await this.personalDetailsRepo.save(detailsToUpdate);
      const personalDetailsModel: PersonalDetailsModel = {
        detailsId: updatedPersonalDetails.detailsId,
        userId: updatedPersonalDetails.userId,
        fatherName: updatedPersonalDetails.fatherName,
        motherName: updatedPersonalDetails.motherName,
        dateOfBirth: updatedPersonalDetails.dateOfBirth,
        maritalStatus: updatedPersonalDetails.maritalStatus,
        languagesKnown: updatedPersonalDetails.languagesKnown,
      };

      return {
        status: true,
        internalMessage: 'Personal details updated successfully',
        data: [personalDetailsModel],
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error updating personal details:', error); // Log the error for debugging
      return {
        status: false,
        internalMessage: 'Failed to update personal details',
        data: null,
        errorCode: 1,
      };
    }
  }

  
  async deletePersonalDetails(detailsId: number): Promise<PersonalDetailsResponse> {
    try {
      const deleteResult = await this.personalDetailsRepo.delete(detailsId);

      if (deleteResult.affected === 0) {
        return {
          status: false,
          internalMessage: 'Personal details not found',
          data: null,
          errorCode: 2,
        };
      }

      return {
        status: true,
        internalMessage: 'Personal details deleted successfully',
        data: null,
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to delete personal details',
        data: null,
        errorCode: 1,
      };
    }
  }


  async getPersonalDetailsById(detailsId: number): Promise<PersonalDetailsResponse> {
    try {
      const detail = await this.personalDetailsRepo.findOne({ where: { detailsId } });

      if (!detail) {
        return {
          status: false,
          internalMessage: 'Personal details not found',
          data: null,
          errorCode: 2,
        };
      }

      const personalDetailsModel: PersonalDetailsModel = {
        detailsId: detail.detailsId,
        userId: detail.userId,
        fatherName: detail.fatherName,
        motherName: detail.motherName,
        dateOfBirth: detail.dateOfBirth,
        maritalStatus: detail.maritalStatus,
        languagesKnown: detail.languagesKnown,
      };

      return {
        status: true,
        internalMessage: 'Personal details retrieved successfully',
        data: [personalDetailsModel],
        errorCode: 0,
      };
    } catch (error) {
      // Log the actual error details for debugging
      console.error('Error retrieving personal details:', error);
      return {
        status: false,
        internalMessage: 'Failed to retrieve personal details',
        data: null,
        errorCode: 1,
      };
    }
  }

  async getPersonalDetailsByUserId(userId: number): Promise<PersonalDetailsResponse> {
    try {
      // Fetch personal details for the given userId
      const details = await this.personalDetailsRepo.find({ where: { userId } });

      if (!details.length) {
        return {
          status: false,
          internalMessage: 'Personal details not found for the user',
          data: null,
          errorCode: 404,
        };
      }

      // Map the fetched details to the desired model
      const personalDetailsModels: PersonalDetailsModel[] = details.map(detail => ({
        detailsId: detail.detailsId,
        userId: detail.userId,
        fatherName: detail.fatherName,
        motherName: detail.motherName,
        dateOfBirth: detail.dateOfBirth,
        maritalStatus: detail.maritalStatus,
        languagesKnown: detail.languagesKnown,
      }));

      return {
        status: true,
        internalMessage: 'Personal details retrieved successfully',
        data: personalDetailsModels,
        errorCode: 0,
      };
    } catch (error) {
      // Log the actual error details for debugging
      console.error('Error retrieving personal details by user ID:', error);
      return {
        status: false,
        internalMessage: 'Failed to retrieve personal details',
        data: null,
        errorCode: 1,
      };
    }
  }
}

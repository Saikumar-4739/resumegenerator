import { Injectable} from '@nestjs/common';
import { UserCreateRequest } from './models/user-create.request';
import { UserIdRequest } from './models/userid.request';
import { UserModel } from './models/user.model';
import { UserResponse } from './models/user.response';
import { AddressModel } from '../address/models/address.model';
import { AddressService } from '../address/address.services';
import {UserRepo} from './userrepo/user.repo'
import { UserDetailedInfoResponse } from './models/user-detailed-info.response';
import { UserEntity } from './user.entities';
import { ExperienceModel } from '../experience/models/exp.model';
import { AcademicModel } from '../academics/models/academics.model';
import { SkillModel } from '../skills/models/skills.model';
import { PersonalDetailsModel } from '../personal-details/models/personal-details.model';
import UserDetailedInfoModel from './models/user-detailed-info.model';



@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AddressRepo: any;
  constructor(
    private UserRepo: UserRepo,
    private addressService: AddressService
  ) {}

  async createUser(userData: UserCreateRequest): Promise<UserResponse> {
    
    if (!userData.address || !Array.isArray(userData.address) || userData.address.length === 0) {
      return {
        status: false,
        internalMessage: 'Address is missing or invalid',
        data: null,
        errorCode: 2,
      };
    }
  
    const existingUser = await this.UserRepo.findOne({ where: { email: userData.email } });
    if (existingUser) {
      return {
        status: false,
        internalMessage: 'User with this email already exists',
        data: null,
        errorCode: 4,
      };
    }  
  let savedUser: UserEntity;
  try {
    const userEnt = new UserEntity();
    userEnt.email = userData.email;
    userEnt.name = userData.uname;
    userEnt.mobile = userData.mobileNo;
    savedUser = await this.UserRepo.save(userEnt);
  } catch (error) {
    return {
      status: false,
      internalMessage: 'Failed to save user',
      data: null,
      errorCode: 5,
    };
  }

  try {
    for (const address of userData.address) {
      address.userid = savedUser.userId;
      await this.addressService.createAddress(address);
    }
  } catch (error) {
    return {
      status: false,
      internalMessage: 'Failed to save address',
      data: null,
      errorCode: 3,
    };
  }

  return {
    status: true,
    internalMessage: 'User created successfully',
    data: [],
    errorCode: null,
  };
}
  
  async deleteUsersByUserIds(req: UserIdRequest): Promise<UserResponse> {
    const userIds = req.userId;

    if (!Array.isArray(userIds) || !userIds.length) {
      return {
        status: false,
        internalMessage: 'No user IDs provided or invalid format',
        data: null,
        errorCode: 1,
      };
    }

    try {
      await this.UserRepo.delete(userIds);
      return {
        status: true,
        internalMessage: 'Users deleted successfully',
        data: null,
        errorCode: 0,
      };
    } catch (error) {
      return {
        status: false,
        internalMessage: 'Failed to delete users',
        data: null,
        errorCode: 2,
      };
    }
  }


  async updateUser(req: UserCreateRequest): Promise<UserResponse> {
    try {
        // const mobileNo = Number(req.mobileNo);
        // if (isNaN(mobileNo)) {
        //     return {
        //         status: false,
        //         internalMessage: 'Invalid mobile number format',
        //         data: [],
        //         errorCode: 4, // New error code for invalid mobile number
        //     };
        // }

        const userToUpdate = await this.UserRepo.findOne({ where: { userId: req.userId } });

        if (!userToUpdate) {
            return {
                status: false,
                internalMessage: 'User not found',
                data: [],
                errorCode: 1,
            };
        }
        userToUpdate.name = req.uname;
        userToUpdate.email = req.email;
        userToUpdate.mobile = req.mobileNo;

        // Update address if provided
        if (req.address && req.address.length > 0) {
            try {
                await this.addressService.updateAddress(req.address[0]);
            } catch (error) {
                return {
                    status: false,
                    internalMessage: 'Failed to update address',
                    data: [],
                    errorCode: 3,
                };
            }
        }

        // Save updated user
        const updatedUser = await this.UserRepo.save(userToUpdate);

      
        const createdate = new Date(updatedUser.createdate);

        const userModel: UserModel = {
            userId: updatedUser.userId,
            uname: updatedUser.name,
            email: updatedUser.email,
            mobileNo: updatedUser.mobile,
            createdate: createdate, 
            address: req.address && req.address.length > 0 ? req.address[0] : null
        };

        return {
            status: true,
            internalMessage: 'User updated successfully',
            data: [userModel],
            errorCode: 0,
        };
    } catch (error) {
        return {
            status: false,
            internalMessage: 'Failed to update user',
            data: [],
            errorCode: 2,
        };
    }
  }


  async getUsersByUserIds(req: { userId: number[] }): Promise<UserDetailedInfoResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userIds = req.userId;
      const users = await this.UserRepo.getUsers(req.userId);

      if (users.length === 0) {
        return {
          status: false,
          internalMessage: 'No users found for the provided IDs',
          data: [],
          errorCode: 404,
        };
      }

      const userDetailedModels: UserDetailedInfoModel[] = users.map(user => {
        const userDetailedModel = new UserDetailedInfoModel();
        userDetailedModel.userId = user.userId;
        userDetailedModel.name = user.name;
        userDetailedModel.email = user.email;
        userDetailedModel.mobile = user.mobile;
        userDetailedModel.createdate = user.createdate;

        const addr = new AddressModel();
        addr.street = user.street;
        addr.city = user.city;
        addr.state = user.state;
        addr.country = user.country;
        addr.zipcode = user.zipcode.toString();
        userDetailedModel.address = addr;

        const expe = new ExperienceModel();
        expe.objective = user.objective;
        expe.companyName = user.companyName;
        expe.role = user.role;
        expe.fromYear = user.fromYear;
        expe.toYear = user.toYear;
        expe.description = user.description;
        userDetailedModel.experience = expe;

        const acade = new AcademicModel();
        acade.institutionName = user.institutionName;
        acade.passingYear = user.passingYear;
        acade.qualification = user.qualification;
        acade.university = user.university;
        acade.percentage = user.percentage;
        userDetailedModel.academic = acade;

        const skill = new SkillModel();
        skill.skillName = user.skillName;
        skill.department = user.department;
        userDetailedModel.skills = skill;

        const pdetails = new PersonalDetailsModel();
        pdetails.fatherName = user.fatherName;
        pdetails.motherName = user.motherName;
        pdetails.dateOfBirth = user.dateOfBirth;
        pdetails.maritalStatus = user.maritalStatus;
        pdetails.languagesKnown = user.languagesKnown;
        userDetailedModel.personalDetails = pdetails;

        return userDetailedModel;
      });

      return {
        status: true,
        internalMessage: 'Users retrieved successfully',
        data: userDetailedModels,
        errorCode: 0,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        status: false,
        internalMessage: 'An error occurred while retrieving users',
        data: [],
        errorCode: 500,
      };
    }
  }

  async getUserById(userId: number): Promise<UserResponse> {
    try {
      const users = await this.UserRepo.getUsers([userId]);
      console.log('User fetched:', users);
  
      if (!users || users.length === 0) {
        return {
          status: false,
          internalMessage: 'User not found',
          data: null,
          errorCode: 1,
        };
      }
  
      const user = users[0];
  
      const userModel = new UserModel();
      userModel.userId = user.userId;
      userModel.uname = user.name;
      userModel.email = user.email;
      userModel.mobileNo = user.mobile;
  
      const addressModel = new AddressModel();
      addressModel.street = user.street;
      addressModel.city = user.city;
      addressModel.state = user.state;
      addressModel.country = user.country;
      addressModel.zipcode = user.zipcode.toString();
  
      userModel.address = addressModel;

  
      return {
        status: true,
        internalMessage: 'User retrieved successfully',
        data: [userModel],
        errorCode: 0,
      };
  
    } catch (error) {
      console.error('Error fetching user by ID:', error);
  
      return {
        status: false,
        internalMessage: 'An error occurred while retrieving the user',
        data: null,
        errorCode: 500,
    };
}
}
}
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserDetailedInfoQueryResponse } from "../models/ueer-detailed-info.query.response";
import { UserEntity } from "../user.entities";
import { AddressEntities } from "../../address/address.entities";
import { Experienceentities } from "../../experience/experience.entities";
import { AcademicEntities } from "../../academics/academics.entities";
import { SkillEntities } from "../../skills/skills.entities";
import PersonalDetailsEntities from "../../personal-details/personal-details.entities";



@Injectable()
export class UserRepo extends Repository <UserEntity> {
    getExpByUserId(userId: number): import("../../experience/models/exp.model").ExperienceModel[] | PromiseLike<import("../../experience/models/exp.model").ExperienceModel[]> {
      throw new Error('Method not implemented.');
    }
    constructor(private datasource: DataSource) {
        super(UserEntity, datasource.createEntityManager());
    }

    async getUsers(userIds: number[]): Promise<UserDetailedInfoQueryResponse[]> {
        const queryBuilder = this.createQueryBuilder('u')
            .select(`u.name , u.email, u.mobile, u.createdate, 
            a.street, a.city,a.state,a.country,a.zipcode,
            e.objective,e.companyName,e.role,e.fromYear,e.toYear,e.description,
            a2.institutionName,a2.passingYear,a2.qualification,a2.university,a2.percentage,
            s.skillName,s.department, 
            pd.fatherName,pd.motherName,pd.dateOfBirth,pd.maritalStatus,pd.languagesKnown`)
            .leftJoin(AddressEntities,'a','a.userid  = u.user_id ')
            .leftJoin(Experienceentities,'e','e.userid = u.user_id')
            .leftJoin(AcademicEntities,'a2','a2.userId = u.user_id')
            .leftJoin(SkillEntities,'s','s.userId = u.user_id')
            .leftJoin(PersonalDetailsEntities,'pd','pd.userId = u.user_id');

            if(userIds.length > 0)
                queryBuilder.where(` u.user_id IN(:...ids)`, {ids: userIds});

            return await queryBuilder.getRawMany();
}

    async findUserIdByEmail(email: string): Promise<number | null> {
    const user = await this.findOne({ where: { email } });
    return user ? user.userId : null;
  }
  
 
}

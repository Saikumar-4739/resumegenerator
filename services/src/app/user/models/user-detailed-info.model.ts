import { AcademicModel } from "../../academics/models/academics.model";
import { AddressModel } from "../../address/models/address.model";
import { ExperienceModel } from "../../experience/models/exp.model";
import { ImageResponse } from "../../image/models/image.response.model";
import { PersonalDetailsModel } from "../../personal-details/models/personal-details.model";
import { SkillModel } from "../../skills/models/skills.model";



class UserDetailedInfoModel {
  userId?: number;
  name: string;
  email: string;
  mobile: string;
  createdate: Date;
  address: AddressModel;
  experience: ExperienceModel[]; 
  academic: AcademicModel[]; 
  skills: SkillModel[]; 
  personalDetails: PersonalDetailsModel;
  image: ImageResponse[];
}

export default UserDetailedInfoModel;

// src/app/layouts/types.ts

export interface Image {
  id: number;
  filename: string;
  path: string;
  userId: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface Experience {
  objective: string;
  companyName: string;
  role: string;
  fromYear: string;
  toYear: string;
  description: string;
}

export interface Academic {
  institutionName: string;
  passingYear: string;
  qualification: string;
  university: string;
  percentage: string;
}

export interface Skills {
  skillName: string;
  department: string;
}

export interface PersonalDetails {
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  maritalStatus: string;
  languagesKnown: string[];
}

export interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  address: Address;
  experience: Experience[];
  academic: Academic[];
  skills: Skills[];
  personalDetails: PersonalDetails;
  profileImageUrl?: string; 
  image?: Image; 
}

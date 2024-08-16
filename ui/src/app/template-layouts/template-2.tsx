import React from 'react';
import "../styles/template-2.css";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface Experience {
  objective: string;
  companyName: string;
  role: string;
  fromYear: string;
  toYear: string;
  description: string;
}

interface Academic {
  institutionName: string;
  passingYear: string;
  qualification: string;
  university: string;
  percentage: string;
}

interface Skills {
  skillName: string;
  department: string;
}

interface PersonalDetails {
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  maritalStatus: string;
  languagesKnown: string;
}

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  address: Address;
  experience: Experience;
  academic: Academic;
  skills: Skills;
  personalDetails: PersonalDetails;
}

const Template2: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template2">
      <h1>{userDetails.name}</h1>
      <div className="section">
        <p>Email: {userDetails.email}</p>
        <p>Mobile: {userDetails.mobile}</p>
      </div>
      <div className="section">
        <h2>Address</h2>
        <p>Street: {userDetails.address.street}</p>
        <p>City: {userDetails.address.city}</p>
        <p>State: {userDetails.address.state}</p>
        <p>Country: {userDetails.address.country}</p>
        <p>Zipcode: {userDetails.address.zipcode}</p>
      </div>
      <div className="section">
        <h2>Experience</h2>
        <p>Objective: {userDetails.experience.objective}</p>
        <p>Company: {userDetails.experience.companyName}</p>
        <p>Role: {userDetails.experience.role}</p>
        <p>Duration: {userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
        <p>Description: {userDetails.experience.description}</p>
      </div>
      <div className="section">
        <h2>Academic</h2>
        <p>Institution: {userDetails.academic.institutionName}</p>
        <p>Passing Year: {userDetails.academic.passingYear}</p>
        <p>Qualification: {userDetails.academic.qualification}</p>
        <p>University: {userDetails.academic.university}</p>
        <p>Percentage: {userDetails.academic.percentage}</p>
      </div>
      <div className="section">
        <h2>Skills</h2>
        <p>Skill: {userDetails.skills.skillName}</p>
        <p>Department: {userDetails.skills.department}</p>
      </div>
      <div className="section">
        <h2>Personal Details</h2>
        <p>Father's Name: {userDetails.personalDetails.fatherName}</p>
        <p>Mother's Name: {userDetails.personalDetails.motherName}</p>
        <p>Date of Birth: {userDetails.personalDetails.dateOfBirth}</p>
        <p>Marital Status: {userDetails.personalDetails.maritalStatus}</p>
        <p>Languages Known: {userDetails.personalDetails.languagesKnown}</p>
      </div>
    </div>
  );
};

export default Template2;

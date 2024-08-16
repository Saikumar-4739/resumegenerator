import React from 'react';
import "../styles/template-3.css"

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

const Template3: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template3">
      <header className="header">
        <h1>{userDetails.name}</h1>
        <p className="contact-info">
          <span>Email: {userDetails.email}</span>
          <span>Mobile: {userDetails.mobile}</span>
        </p>
      </header>

      <section className="address-section">
        <h2>Address</h2>
        <p>{userDetails.address.street}</p>
        <p>{userDetails.address.city}, {userDetails.address.state}</p>
        <p>{userDetails.address.country} - {userDetails.address.zipcode}</p>
      </section>

      <section className="experience-section">
        <h2>Experience</h2>
        <p><strong>Objective:</strong> {userDetails.experience.objective}</p>
        <p><strong>Company:</strong> {userDetails.experience.companyName}</p>
        <p><strong>Role:</strong> {userDetails.experience.role}</p>
        <p><strong>Duration:</strong> {userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
        <p><strong>Description:</strong> {userDetails.experience.description}</p>
      </section>

      <section className="academic-section">
        <h2>Academic Details</h2>
        <p><strong>Institution:</strong> {userDetails.academic.institutionName}</p>
        <p><strong>Passing Year:</strong> {userDetails.academic.passingYear}</p>
        <p><strong>Qualification:</strong> {userDetails.academic.qualification}</p>
        <p><strong>University:</strong> {userDetails.academic.university}</p>
        <p><strong>Percentage:</strong> {userDetails.academic.percentage}</p>
      </section>

      <section className="skills-section">
        <h2>Skills</h2>
        <p><strong>Skill Name:</strong> {userDetails.skills.skillName}</p>
        <p><strong>Department:</strong> {userDetails.skills.department}</p>
      </section>

      <section className="personal-details-section">
        <h2>Personal Details</h2>
        <p><strong>Father's Name:</strong> {userDetails.personalDetails.fatherName}</p>
        <p><strong>Mother's Name:</strong> {userDetails.personalDetails.motherName}</p>
        <p><strong>Date of Birth:</strong> {userDetails.personalDetails.dateOfBirth}</p>
        <p><strong>Marital Status:</strong> {userDetails.personalDetails.maritalStatus}</p>
        <p><strong>Languages Known:</strong> {userDetails.personalDetails.languagesKnown}</p>
      </section>
    </div>
  );
};

export default Template3;

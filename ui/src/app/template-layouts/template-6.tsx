import React from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-6.css";

const Template6: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template6">
      <div className="header">
        <h1 className='name'>{userDetails.name}</h1>
        <div className="contact-info">
          <p>{userDetails.email}</p>
          <p>{userDetails.mobile}</p>
          <p>{userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country} - {userDetails.address.zipcode}</p>
        </div>
      </div>
      <div className="body">
        <div className="objective">
          <h2>Objective</h2>
          <p>{userDetails.experience.objective}</p>
        </div>
        <div className="experience">
          <h2>Experience</h2>
          <p>{userDetails.experience.companyName}</p>
          <p>{userDetails.experience.role}</p>
          <p>{userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
          <p>{userDetails.experience.description}</p>
        </div>
        <div className="academics">
          <h2>Academics</h2>
          <p>{userDetails.academic.institutionName}</p>
          <p>{userDetails.academic.passingYear}</p>
          <p>{userDetails.academic.qualification}</p>
          <p>{userDetails.academic.university}</p>
          <p>{userDetails.academic.percentage}</p>
        </div>
        <div className="skills">
          <h2>Skills</h2>
          <p>{userDetails.skills.skillName}</p>
          <p>{userDetails.skills.department}</p>
        </div>
        <div className="personal-details">
          <h2>Personal Details</h2>
          <p>{userDetails.personalDetails.fatherName}</p>
          <p>{userDetails.personalDetails.motherName}</p>
          <p>{userDetails.personalDetails.dateOfBirth}</p>
          <p>{userDetails.personalDetails.maritalStatus}</p>
          <p>{userDetails.personalDetails.languagesKnown}</p>
        </div>
      </div>
    </div>
  );
};

export default Template6;

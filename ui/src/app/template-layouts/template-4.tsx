import React from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-4.css"

const Template4: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template4">
      <h1 className="names">{userDetails.name}</h1>
      <div className="contact-info">
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Mobile:</strong> {userDetails.mobile}</p>
        <p><strong>Address:</strong> {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country} - {userDetails.address.zipcode}</p>
      </div>
      <div className="objective section">
        <h2>Objective</h2>
        <p>{userDetails.experience.objective}</p>
      </div>
      <div className="experience section">
        <h2>Experience</h2>
        <p><strong>Company:</strong> {userDetails.experience.companyName}</p>
        <p><strong>Role:</strong> {userDetails.experience.role}</p>
        <p><strong>Duration:</strong> {userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
        <p><strong>Description:</strong> {userDetails.experience.description}</p>
      </div>
      <div className="academics section">
        <h2>Academics</h2>
        <p><strong>Institution:</strong> {userDetails.academic.institutionName}</p>
        <p><strong>Passing Year:</strong> {userDetails.academic.passingYear}</p>
        <p><strong>Qualification:</strong> {userDetails.academic.qualification}</p>
        <p><strong>University:</strong> {userDetails.academic.university}</p>
        <p><strong>Percentage:</strong> {userDetails.academic.percentage}</p>
      </div>
      <div className="skills section">
        <h2>Skills</h2>
        <p><strong>Skills:</strong> {userDetails.skills.skillName}</p>
        <p><strong>Department:</strong> {userDetails.skills.department}</p>
      </div>
      <div className="personal-details section">
        <h2>Personal Details</h2>
        <p><strong>Father's Name:</strong> {userDetails.personalDetails.fatherName}</p>
        <p><strong>Mother's Name:</strong> {userDetails.personalDetails.motherName}</p>
        <p><strong>Date of Birth:</strong> {userDetails.personalDetails.dateOfBirth}</p>
        <p><strong>Marital Status:</strong> {userDetails.personalDetails.maritalStatus}</p>
        <p><strong>Languages Known:</strong> {userDetails.personalDetails.languagesKnown}</p>
      </div>
    </div>
  );
};

export default Template4;

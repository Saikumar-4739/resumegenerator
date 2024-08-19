import React from 'react';
import "../styles/template-2.css";
import { UserDetails } from '../layouts/types';

const Template2: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template2">
      <h1>{userDetails.name}</h1>
      <div className="section">
        <p>Email: {userDetails.email}</p>
        <p>Mobile: {userDetails.mobile}</p>
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
        <p>Address: {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country} - {userDetails.address.zipcode}</p>
      </div>
    </div>
  );
};

export default Template2;

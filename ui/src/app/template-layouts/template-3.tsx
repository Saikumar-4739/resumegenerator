import React from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-3.css"

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
        <p><strong>Skills:</strong> {userDetails.skills.skillName}</p>
        <p><strong>Department:</strong> {userDetails.skills.department}</p>
      </section>

      <section className="personal-details-section">
        <h2>Personal Details</h2>
        <ul>
          <li><strong>Father's Name:</strong> {userDetails.personalDetails.fatherName}</li>
          <li><strong>Mother's Name:</strong> {userDetails.personalDetails.motherName}</li>
          <li><strong>Date of Birth:</strong> {userDetails.personalDetails.dateOfBirth}</li>
          <li><strong>Marital Status:</strong> {userDetails.personalDetails.maritalStatus}</li>
          <li><strong>Languages Known:</strong> {userDetails.personalDetails.languagesKnown}</li>
          <li><strong>Address:</strong> {`${userDetails.address.street}, ${userDetails.address.city}, ${userDetails.address.state}, ${userDetails.address.country} - ${userDetails.address.zipcode}`}</li>
        </ul>
      </section>
    </div>
  );
};

export default Template3;

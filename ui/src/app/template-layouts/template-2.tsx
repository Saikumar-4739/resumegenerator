import React from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-2.css";

const Template2: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template2">
      <header className="header">
        <h1 className="name">{userDetails.name}</h1>
        <p className="contact">
          {userDetails.email} | {userDetails.mobile} | {userDetails.address.city}, {userDetails.address.state} {userDetails.address.zipcode}
        </p>
      </header>

      <section className="section objective-section">
        <h2 className="section-title">Objective</h2>
        <p>{userDetails.experience.objective}</p>
      </section>

      <section className="section">
        <h2 className="section-title">Experience</h2>
        <p><strong>Company:</strong> {userDetails.experience.companyName}</p>
        <p><strong>Role:</strong> {userDetails.experience.role}</p>
        <p><strong>Duration:</strong> {userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
        <p><strong>Description:</strong> {userDetails.experience.description}</p>
      </section>

      <section className="section">
        <h2 className="section-title">Academic</h2>
        <p><strong>Institution:</strong> {userDetails.academic.institutionName}</p>
        <p><strong>Passing Year:</strong> {userDetails.academic.passingYear}</p>
        <p><strong>Qualification:</strong> {userDetails.academic.qualification}</p>
        <p><strong>University:</strong> {userDetails.academic.university}</p>
        <p><strong>Percentage:</strong> {userDetails.academic.percentage}</p>
      </section>

      <section className="section">
        <h2 className="section-title">Skills</h2>
        <p><strong>Skills:</strong> {userDetails.skills.skillName}</p>
        <p><strong>Department:</strong> {userDetails.skills.department}</p>
      </section>

      <section className="section">
        <h2 className="section-title">Personal Details</h2>
        <p><strong>Father's Name:</strong> {userDetails.personalDetails.fatherName}</p>
        <p><strong>Mother's Name:</strong> {userDetails.personalDetails.motherName}</p>
        <p><strong>Date of Birth:</strong> {userDetails.personalDetails.dateOfBirth}</p>
        <p><strong>Marital Status:</strong> {userDetails.personalDetails.maritalStatus}</p>
        <p><strong>Languages Known:</strong> {userDetails.personalDetails.languagesKnown}</p>
      </section>
    </div>
  );
};

export default Template2;

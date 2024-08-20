import React from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-5.css";

const Template5: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template5">
      <header>
        <h1>{userDetails.name}</h1>
        <div className="contact-info">
          <p>Email: {userDetails.email}</p>
          <p>Mobile: {userDetails.mobile}</p>
          <p>Address: {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country} - {userDetails.address.zipcode}</p>
        </div>
      </header>
      <section className="objective">
        <h2>Objective</h2>
        <p>{userDetails.experience.objective}</p>
      </section>
      <section className="experience">
        <h2>Experience</h2>
        <p>Company: {userDetails.experience.companyName}</p>
        <p>Role: {userDetails.experience.role}</p>
        <p>Duration: {userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
        <p>Description: {userDetails.experience.description}</p>
      </section>
      <section className="academics">
        <h2>Academics</h2>
        <p>Institution: {userDetails.academic.institutionName}</p>
        <p>Passing Year: {userDetails.academic.passingYear}</p>
        <p>Qualification: {userDetails.academic.qualification}</p>
        <p>University: {userDetails.academic.university}</p>
        <p>Percentage: {userDetails.academic.percentage}</p>
      </section>
      <section className="skills">
        <h2>Skills</h2>
        <p>Skills: {userDetails.skills.skillName}</p>
        <p>Department: {userDetails.skills.department}</p>
      </section>
      <section className="personal-details">
        <h2>Personal Details</h2>
        <p>Father's Name: {userDetails.personalDetails.fatherName}</p>
        <p>Mother's Name: {userDetails.personalDetails.motherName}</p>
        <p>Date of Birth: {userDetails.personalDetails.dateOfBirth}</p>
        <p>Marital Status: {userDetails.personalDetails.maritalStatus}</p>
        <p>Languages Known: {userDetails.personalDetails.languagesKnown}</p>
      </section>
    </div>
  );
};

export default Template5;

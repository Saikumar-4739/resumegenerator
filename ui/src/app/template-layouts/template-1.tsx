import React from 'react';
import { Card, Row, Col } from 'antd';
import "../styles/template-1.css"

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

const Template1: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  return (
    <div className="template1">
      <Card bordered={false} className="resume-card">
        <h1 className="resume-title">{userDetails.name}</h1>
        <h2 className="objective-title">Objective</h2>
        <p className="objective-text">{userDetails.experience.objective}</p>

        <Row className="resume-section">
          <Col span={24}>
            <h3>Experience</h3>
            <p><strong>Company:</strong> {userDetails.experience.companyName}</p>
            <p><strong>Role:</strong> {userDetails.experience.role}</p>
            <p><strong>Duration:</strong> {userDetails.experience.fromYear} - {userDetails.experience.toYear}</p>
            <p><strong>Description:</strong> {userDetails.experience.description}</p>
          </Col>
        </Row>

        <Row className="resume-section">
          <Col span={24}>
            <h3>Academic</h3>
            <p><strong>Institution:</strong> {userDetails.academic.institutionName}</p>
            <p><strong>Passing Year:</strong> {userDetails.academic.passingYear}</p>
            <p><strong>Qualification:</strong> {userDetails.academic.qualification}</p>
            <p><strong>University:</strong> {userDetails.academic.university}</p>
            <p><strong>Percentage:</strong> {userDetails.academic.percentage}</p>
          </Col>
        </Row>

        <Row className="resume-section">
          <Col span={24}>
            <h3>Skills</h3>
            <p><strong>Skill Name:</strong> {userDetails.skills.skillName}</p>
            <p><strong>Department:</strong> {userDetails.skills.department}</p>
          </Col>
        </Row>

        <Row className="resume-section">
          <Col span={24}>
            <h3>Personal Details</h3>
            <p><strong>Father's Name:</strong> {userDetails.personalDetails.fatherName}</p>
            <p><strong>Mother's Name:</strong> {userDetails.personalDetails.motherName}</p>
            <p><strong>Date of Birth:</strong> {userDetails.personalDetails.dateOfBirth}</p>
            <p><strong>Marital Status:</strong> {userDetails.personalDetails.maritalStatus}</p>
            <p><strong>Languages Known:</strong> {userDetails.personalDetails.languagesKnown}</p>
          </Col>
        </Row>

        <Row className="resume-section">
          <Col span={24}>
            <h3>Address</h3>
            <p>{userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country} - {userDetails.address.zipcode}</p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Template1;

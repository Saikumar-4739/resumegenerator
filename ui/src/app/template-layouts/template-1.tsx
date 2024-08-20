import React, { useEffect, useState } from 'react';
import { UserDetails } from '../layouts/types';
import './styles/template-1.css'; // Ensure your CSS file includes styles for the component

const Template1: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  const [data, setData] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (userDetails) {
      setData(userDetails);
    }
  }, [userDetails]);

  return (
    <div className="template1">
      {data && (
        <>
          <div className="header text-center mb-4">
            <h1>{data.name}</h1>
          </div>

          <div className="contact-info mb-4">
            <div className="contact-item">
              <p><strong>Email:</strong> {data.email}</p>
            </div>
            <div className="contact-item">
              <p><strong>Mobile:</strong> {data.mobile}</p>
            </div>
            <div className="contact-item">
              <p>
                <strong>Address:</strong> {data.address?.street}, {data.address?.city}, {data.address?.state}, {data.address?.country} - {data.address?.zipcode}
              </p>
            </div>
          </div>

          <div className="section mb-4">
            <h2>Experience</h2>
            <ul className="list">
              {data.experience?.map((rec, index) => (
                <li key={index} className="list-item">
                  <strong>{rec.companyName}</strong>
                  <p>{rec.role}</p>
                  <p>{rec.fromYear} - {rec.toYear}</p>
                  <p>{rec.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="section mb-4">
            <h2>Academics</h2>
            <ul className="list">
              {data.academic?.map((rec, index) => (
                <li key={index} className="list-item">
                  <strong>{rec.institutionName}</strong>
                  <p>{rec.passingYear}</p>
                  <p>{rec.qualification}</p>
                  <p>{rec.university}</p>
                  <p>{rec.percentage}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="section mb-4">
            <h2>Skills</h2>
            <ul className="list">
              {data.skills?.map((rec, index) => (
                <li key={index} className="list-item">
                  <strong>{rec.skillName}</strong>
                  <p>{rec.department}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="section mb-4">
            <h2>Personal Details</h2>
            <ul className="list">
              <li className="list-item">
                <strong>Father's Name:</strong> {data.personalDetails?.fatherName}
              </li>
              <li className="list-item">
                <strong>Mother's Name:</strong> {data.personalDetails?.motherName}
              </li>
              <li className="list-item">
                <strong>Date of Birth:</strong> {data.personalDetails?.dateOfBirth}
              </li>
              <li className="list-item">
                <strong>Marital Status:</strong> {data.personalDetails?.maritalStatus}
              </li>
              <li className="list-item">
                <strong>Languages Known:</strong> {data.personalDetails?.languagesKnown}
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Template1;

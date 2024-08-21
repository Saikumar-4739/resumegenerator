import React, { useEffect, useState } from 'react';
import { UserDetails } from '../layouts/types';
import './styles/template-1.css';

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
          <div className="header">
            <h1>{data.name}</h1>
          </div>
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
          <div className="section">
            <h2>Experience</h2>
            <ul className="list">
              {data.experience?.map((rec, index) => (
                <li key={index} className="list-item">
                  <div>
                    <strong>{rec.companyName}</strong>
                  </div>
                  <div>
                    <p>{rec.role}</p>
                    <p>{rec.fromYear} - {rec.toYear}</p>
                    <p>{rec.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Academics</h2>
            <ul className="list">
              {data.academic?.map((rec, index) => (
                <li key={index} className="list-item">
                  <div>
                    <strong>{rec.institutionName}</strong>
                  </div>
                  <div>
                    <p>{rec.passingYear}</p>
                    <p>{rec.qualification}</p>
                    <p>{rec.university}</p>
                    <p>{rec.percentage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Skills</h2>
            <ul className="list">
              {data.skills?.map((rec, index) => (
                <li key={index} className="list-item">
                  <div>
                    <strong>{rec.skillName}</strong>
                  </div>
                  <div>
                    <p>{rec.department}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Personal Details</h2>
            <ul className="list">
              <li className="list-item">
                <p><strong>Father's Name:</strong> {data.personalDetails?.fatherName}</p>
              </li>
              <li className="list-item">
                <p><strong>Mother's Name:</strong> {data.personalDetails?.motherName}</p>
              </li>
              <li className="list-item">
                <p><strong>Date of Birth:</strong> {data.personalDetails?.dateOfBirth}</p>
              </li>
              <li className="list-item">
                <p><strong>Marital Status:</strong> {data.personalDetails?.maritalStatus}</p>
              </li>
              <li className="list-item">
                <p><strong>Languages Known:</strong> {data.personalDetails?.languagesKnown}</p>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Template1;

import React, { useEffect, useState } from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-6.css"

const Template6: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  const [data, setData] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (userDetails) {
      setData(userDetails);
      console.log(userDetails, "User Details Set");
    }
  }, [userDetails]);

  console.log(data, "Data State");

  return (
    <div className="template1">
      {data && (
        <>
          <h1>{data.name}</h1>
          <div className="section">
            <p>Email: {data.email}</p>
            <p>Mobile: {data.mobile}</p>
            <p>Address: {data.address?.street}, {data.address?.city}, {data.address?.state}, {data.address?.country} - {data.address?.zipcode}</p>
          </div>

          <div className="section">
            <h2>Experience</h2>
            {data.experience?.map((rec, index) => (
              <div key={index}>
                <p>Company: {rec.companyName}</p>
                <p>Role: {rec.role}</p>
                <p>Duration: {rec.fromYear} - {rec.toYear}</p>
                <p>Description: {rec.description}</p>
              </div>
            ))}
          </div>
          
          <div className="section">
            <h2>Academics</h2>
            {data.academic?.map((rec, index)=> (
              <div key={index}>
                <p>Instituion: {rec.institutionName}</p>
                <p>Passing Year: {rec.passingYear}</p>
                <p>Qualification: {rec.qualification}</p>
                <p>University: {rec.university}</p>
                <p>Percentage: {rec.percentage}</p>
            </div>
          ))}
          </div>

          <div className="section">
            <h2>Skills</h2>
            {data.skills?.map((rec, index)=>
            <div key={index}>
              <p>{rec.skillName}</p>
              <p>{rec.department}</p>
            </div>
            )}
          </div>

          <div className="section">
            <h2>Personal Details</h2>
            <p>Father's Name: {data.personalDetails?.fatherName}</p>
            <p>Mother's Name: {data.personalDetails?.motherName}</p>
            <p>Date of Birth: {data.personalDetails?.dateOfBirth}</p>
            <p>Marital Status: {data.personalDetails?.maritalStatus}</p>
            <p>Languages Known: {data.personalDetails?.languagesKnown}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Template6;

import React, { useEffect, useState } from 'react';
import { UserDetails } from '../layouts/types';
import "./styles/template-2.css"

const Template2: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  const [data, setData] = useState<UserDetails | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [skillSet, setSkillsSet] = useState([]);

  useEffect(() => {
    if (userDetails) {
      const d = userDetails.skills[0].skillName.split(', ');
      setSkillsSet(d);
      setData(userDetails);
      if (userDetails.profileImageUrl) {
        setUserImage(userDetails.profileImageUrl);
      }
    }
  }, [userDetails]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-container2">
      <div className="user-details2">
        <div className="header2">
          {userImage && (
            <img src={userImage} alt="User" className="user-image-header2" />
          )}
          <h1>{data.name}</h1>
        </div>
        <div className="mainBox">
          <div className="leftBox">
            <div className="contact-item">
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Mobile:</strong> {data.mobile}
              </p>
              <p>
                <strong>Address:</strong> {data.address?.street},{' '}
                {data.address?.city}, {data.address?.state},{' '}
                {data.address?.country} - {data.address?.zipcode}
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
                      <p>
                        {rec.fromYear} - {rec.toYear}
                      </p>
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
          </div>
          <div className="rightBox">
            <div className="section">
              <h2>Skills</h2>
              <ul className="list skillBoxMain">
                {skillSet.map((rec, index) => (
                  <li key={index + rec} className="list-item skillBox">
                    <div>
                      <strong>{rec}</strong>
                    </div>
                    {/* <div>
                      <p>{rec.department}</p>
                    </div> */}
                  </li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h2>Personal Details</h2>
              <ul className="list">
                <li className="list-item">
                  <p>
                    <strong>Father's Name:</strong>{' '}
                    {data.personalDetails?.fatherName}
                  </p>
                </li>
                <li className="list-item">
                  <p>
                    <strong>Mother's Name:</strong>{' '}
                    {data.personalDetails?.motherName}
                  </p>
                </li>
                <li className="list-item">
                  <p>
                    <strong>Date of Birth:</strong>{' '}
                    {data.personalDetails?.dateOfBirth}
                  </p>
                </li>
                <li className="list-item">
                  <p>
                    <strong>Marital Status:</strong>{' '}
                    {data.personalDetails?.maritalStatus}
                  </p>
                </li>
                <li className="list-item">
                  <p>
                    <strong>Languages Known:</strong>{' '}
                    {data.personalDetails?.languagesKnown.join(', ')}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;

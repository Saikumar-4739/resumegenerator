import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { MailOutlined, PhoneOutlined, HomeOutlined, FlagOutlined } from "@ant-design/icons";
import axios from "axios";
import "../styles/resume.css"

export const DownloadPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId") || "0");
        if (!userId) {
          throw new Error("User ID is not available");
        }

        const response = await axios.post('http://localhost:3023/users/getUsersByUserIds', {
          userId: [userId],
        });

        if (response.data.status) {
          const user = response.data.data[0];
          setUserDetails(user);
        } else {
          throw new Error(response.data.internalMessage || "Failed to fetch user details");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          message.error("Failed to fetch user details");
        } else {
          setError("An unknown error occurred");
          message.error("Failed to fetch user details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDownload = () => {
    if (!userDetails) return;

    const resumeContent = document.getElementById("resume-template");
    if (resumeContent) {
      html2canvas(resumeContent).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();

        // Optional: Set the PDF dimensions
        const pdfWidth = pdf.internal.pageSize.width;
        const pdfHeight = pdf.internal.pageSize.height;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Save the PDF
        pdf.save("resume.pdf");
      });
    }
  };

  const handleBack = () => {
    navigate("/preview-resume");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails) {
    return <div>No user details available</div>;
  }

  return (
    <div className="resume-template" id="resume-template">
      <h1><p>{userDetails.name}</p></h1>
      <div className="section">

        <p><MailOutlined /> Email: {userDetails.email}</p>
        <p><PhoneOutlined /> Mobile: {userDetails.mobile}</p>
        <p><HomeOutlined /> Address: {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country} - {userDetails.address.zipcode}</p>
      </div>
      <div className="section">
        <h2>Experience</h2>
        <p>Objective: {userDetails.experience.objective}</p>
        <p>Company Name: {userDetails.experience.companyName}</p>
        <p>Role: {userDetails.experience.role}</p>
        <p>From Year: {userDetails.experience.fromYear} - To Year: {userDetails.experience.toYear}</p>
        <p>Description: {userDetails.experience.description}</p>
      </div>
      <div className="section">
        <h2>Academic</h2>
        <p>Institution Name: {userDetails.academic.institutionName}</p>
        <p>Passing Year: {userDetails.academic.passingYear}</p>
        <p>Qualification: {userDetails.academic.qualification}</p>
        <p>University: {userDetails.academic.university}</p>
        <p>Percentage: {userDetails.academic.percentage}</p>
      </div>
      <div className="section">
        <h2>Skills</h2>
        <p>Skill Name: {userDetails.skills.skillName}</p>
        <p>Department: {userDetails.skills.department}</p>
      </div>
      <div className="section">
        <h2>Personal Details</h2>
        <p><FlagOutlined /> Father's Name: {userDetails.personalDetails.fatherName}</p>
        <p><FlagOutlined /> Mother's Name: {userDetails.personalDetails.motherName}</p>
        <p><FlagOutlined /> Marital Status: {userDetails.personalDetails.maritalStatus}</p>
        <p><FlagOutlined /> Date of Birth: {userDetails.personalDetails.dateOfBirth}</p>
        <p><FlagOutlined /> Languages Known: {userDetails.personalDetails.languagesKnown}</p>
      </div>
      <div className="button-container">
        <Button type="primary" onClick={handleDownload} style={{ marginRight: 8 }}>
          Download PDF
        </Button>
        <Button type="default" onClick={handleBack}>
          Back to Preview
        </Button>
      </div>
    </div>
  );
};

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

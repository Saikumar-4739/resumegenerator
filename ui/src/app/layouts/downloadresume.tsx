import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/resume.css";
import TemplateSelector from "../template-layouts/template-selector";

// Define the types for UserDetails
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

  const handleDownload = async () => {
    if (!userDetails) return;

    const resumeTemplate = document.getElementById("resume-template");
    const buttons = document.querySelector(".button-container") as HTMLElement;
    const templateSelector = document.querySelector(".template-selector-container") as HTMLElement;

    if (resumeTemplate && buttons && templateSelector) {
   
      buttons.style.display = "none";
      templateSelector.style.display = "none";

   
      resumeTemplate.style.visibility = 'visible';
      resumeTemplate.style.position = 'relative';
      resumeTemplate.style.width = '210mm'; 
      resumeTemplate.style.height = '297mm';
      resumeTemplate.style.overflow = 'hidden';

      try {
        const canvas = await html2canvas(resumeTemplate, {
          useCORS: true,
          scale: 2, 
          backgroundColor: null 
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [210, 297] 
        });

       
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

      
        const pdfWidth = 210;
        const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

   
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Save the PDF
        pdf.save("resume.pdf");
      } catch (error) {
        message.error("Failed to capture resume content");
        console.error(error);
      } finally {
        // Restore the hidden elements
        buttons.style.display = "block";
        templateSelector.style.display = "block";
      }
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
      <TemplateSelector userDetails={userDetails} />
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
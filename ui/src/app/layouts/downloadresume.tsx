import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/downloadresume.css";
import Template1 from '../template-layouts/template-1';
import Template2 from '../template-layouts/template-2';
import Template3 from '../template-layouts/template-3';
import Template4 from '../template-layouts/template-4';
import Template5 from '../template-layouts/template-5';
import Template6 from '../template-layouts/template-6';
import { UserDetails } from './types';

export const DownloadPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId") || "0");
        if (!userId) {
          throw new Error("User ID is not available");
        }

        const response = await axios.post(`http://localhost:3023/users/getUsersByUserIds/${userId}`);

        if (response.data.status) {
          const users = response.data.data; // Assuming this is an array of user details
          setUserDetails(users);
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
    if (!userDetails.length) return;
  
    const resumeContent = document.getElementById("resume-content");
  
    if (resumeContent) {
      const buttons = document.querySelector(".button-container") as HTMLElement;
      const templateSelector = document.querySelector(".template-selection") as HTMLElement;
  
      if (buttons && templateSelector) {
        buttons.style.display = "none";
        templateSelector.style.display = "none";
      }
  
      // Ensure the content is visible
      resumeContent.style.visibility = 'visible';
      resumeContent.style.position = 'relative';
      resumeContent.style.width = '8.5inch'; // A4 width
      resumeContent.style.height = '11inch'; // A4 height
      resumeContent.style.overflow = 'visible'; // Make sure overflow is visible
  
      try {
        const canvas = await html2canvas(resumeContent, {
          useCORS: true,
          scale: 2, // Increase scale if needed for higher resolution
          backgroundColor: null
        });
  
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [210, 297] // A4 paper size
        });
  
        // Adjust dimensions based on the content
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio
  
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
        // Adjust if content is larger than A4
        if (pdfHeight > 297) {
          // If content height exceeds A4 size, adjust scale or split content if necessary
          pdf.internal.pageSize.height = pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }
  
        pdf.save("resume.pdf");
  
        console.log('PDF saved successfully.');
      } catch (error) {
        message.error("Failed to capture resume content");
        console.error('Error capturing resume content:', error);
      } finally {
        // Restore the hidden elements
        if (buttons && templateSelector) {
          buttons.style.display = "block";
          templateSelector.style.display = "block";
        }
      }
    }
  };
  
   
  const handleBack = () => {
    navigate("/preview-resume");
  };

  const renderTemplate = (templateNumber: number, user: UserDetails) => {
    switch (templateNumber) {
      case 1:
        return <Template1 userDetails={user} />;
      case 2:
        return <Template2 userDetails={user} />;
      case 3:
        return <Template3 userDetails={user} />;
      case 4:
        return <Template4 userDetails={user} />;
      case 5:
        return <Template5 userDetails={user} />;
      case 6:
        return <Template6 userDetails={user} />;
      default:
        return null;
    }
  };

  const renderTemplates = () => {
    return userDetails.map((user, index) => (
      <div key={index} className="resume-content">
        {renderTemplate(selectedTemplate, user)}
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails.length) {
    return <div>No user details available</div>;
  }

  return (
    <div className="download-page">
      <div className="button-container">
        <Button type="primary" onClick={handleDownload} style={{ marginRight: 8 }}>
          Download PDF
        </Button>
        <Button type="default" onClick={handleBack}>
          Back to Preview
        </Button>
      </div>
      <div className="template-selection">
        <Button
          type={selectedTemplate === 1 ? 'primary' : 'default'}
          onClick={() => setSelectedTemplate(1)}
        >
          Template 1
        </Button>
        <Button
          type={selectedTemplate === 2 ? 'primary' : 'default'}
          onClick={() => setSelectedTemplate(2)}
        >
          Template 2
        </Button>
        <Button
          type={selectedTemplate === 3 ? 'primary' : 'default'}
          onClick={() => setSelectedTemplate(3)}
        >
          Template 3
        </Button>
        <Button
          type={selectedTemplate === 4 ? 'primary' : 'default'}
          onClick={() => setSelectedTemplate(4)}
        >
          Template 4
        </Button>
        <Button
          type={selectedTemplate === 5 ? 'primary' : 'default'}
          onClick={() => setSelectedTemplate(5)}
        >
          Template 5
        </Button>
        <Button
          type={selectedTemplate === 6 ? 'primary' : 'default'}
          onClick={() => setSelectedTemplate(6)}
        >
          Template 6
        </Button>
      </div>
      <div id="resume-content">
        {renderTemplates()}
      </div>
    </div>
  );
};

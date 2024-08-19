/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { UserDetails } from './types';

export const DownloadPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
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
      resumeContent.style.width = '210mm';
      resumeContent.style.height = '350mm';
      resumeContent.style.overflow = 'hidden';

      try {
        const canvas = await html2canvas(resumeContent, {
          useCORS: true,
          scale: 2,
          backgroundColor: null
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [210, 350]
        });

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const pdfWidth = 210;
        const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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

  const renderTemplate = (templateNumber: number) => {
    switch (templateNumber) {
      case 1:
        return <Template1 userDetails={userDetails!} />;
      case 2:
        return <Template2 userDetails={userDetails!} />;
      case 3:
        return <Template3 userDetails={userDetails!} />;
      default:
        return null;
    }
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
      </div>
      <div className="resume-content" id="resume-content">
        {renderTemplate(selectedTemplate)}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/downloadresume.css";
import Template1 from '../template-layouts/template-1';
// import Template2 from '../template-layouts/template-2';
// import Template3 from '../template-layouts/template-3';
// import Template4 from '../template-layouts/template-4';
// import Template5 from '../template-layouts/template-5';
// import Template6 from '../template-layouts/template-6';
import { UserDetails } from './types';

export const DownloadPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [base64Images, setBase64Images] = useState<{ [key: number]: string }>({});
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
          const users = response.data.data.map((user: UserDetails) => ({
            ...user,
            profileImageUrl: user.image ? `http://localhost:3023/images/uploads/${user.image.path}` : undefined
          }));
          setUserDetails(users);
          await convertImagesToBase64(users);
        } else {
          throw new Error(response.data.internalMessage || "Failed to fetch user details");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
        message.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    const convertImagesToBase64 = async (users: UserDetails[]) => {
      const images: { [key: number]: string } = {};
      await Promise.all(users.map(async (user, index) => {
        if (user.profileImageUrl) {
          try {
            const response = await fetch(user.profileImageUrl);
            if (!response.ok) throw new Error("Image fetch failed");

            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              images[index] = reader.result as string;
              console.log(`Converted image for user at index ${index}:`, images[index]); // Debug log
              setBase64Images(prev => ({ ...prev, ...images }));
            };
            reader.readAsDataURL(blob);
          } catch (error) {
            console.error(`Error converting image for user at index ${index}:`, error);
          }
        }
      }));
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

      resumeContent.style.visibility = 'visible';
      resumeContent.style.position = 'relative';
      resumeContent.style.width = '190mm'; 
      resumeContent.style.height = 'auto'; 
      resumeContent.style.overflow = 'visible';

      try {
        const pdfOptions = {
          margin: 10,
          filename: 'resume.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().from(resumeContent).set(pdfOptions).save();
        console.log('PDF saved successfully.');
      } catch (error) {
        message.error("Failed to capture resume content");
        console.error('Error capturing resume content:', error);
      } finally {
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

  const renderTemplate = (templateNumber: number, user: UserDetails, index: number) => {
    switch (templateNumber) {
      case 1:
        return <Template1 userDetails={{ ...user, profileImageUrl: base64Images[index] }} />;
      // case 2:
      //   return <Template2 userDetails={{ ...user, profileImageUrl: base64Images[index] }} />;
      // case 3:
      //   return <Template3 userDetails={{ ...user, profileImageUrl: base64Images[index] }} />;
      // case 4:
      //   return <Template4 userDetails={{ ...user, profileImageUrl: base64Images[index] }} />;
      // case 5:
      //   return <Template5 userDetails={{ ...user, profileImageUrl: base64Images[index] }} />;
      // case 6:
      //   return <Template6 userDetails={{ ...user, profileImageUrl: base64Images[index] }} />;
      default:
        return null;
    }
  };

  const renderTemplates = () => {
    return userDetails.map((user, index) => (
      <div key={index} className="resume-content">
        {renderTemplate(selectedTemplate, user, index)}
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
        {[1, 2, 3, 4, 5, 6].map((templateNumber) => (
          <Button
            key={templateNumber}
            type={selectedTemplate === templateNumber ? 'primary' : 'default'}
            onClick={() => setSelectedTemplate(templateNumber)}
          >
            Template {templateNumber}
          </Button>
        ))}
      </div>
      <div id="resume-content">
        {renderTemplates()}
      </div>
    </div>
  );
};

import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserDetails } from './types';
import '../styles/downloadresume.css';
import Template1 from '../template-layouts/template-1';
import axios from 'axios';

export const DownloadPage: React.FC = () => {
  const [userDetails, setUserDetails] = React.useState<UserDetails[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<number>(1);
  const [base64Images, setBase64Images] = React.useState<{
    [key: number]: string;
  }>({});
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = parseInt(localStorage.getItem('userId') || '0');
        if (!userId) {
          throw new Error('User ID is not available');
        }

        const response = await axios.post(
          `http://localhost:3023/users/getUsersByUserIds/${userId}`
        );

        if (response.data.status) {
          const users = response.data.data.map((user: UserDetails) => ({
            ...user,
            profileImageUrl: user.image
              ? `http://localhost:3023/images/uploads/${user.image.path}`
              : undefined,
          }));
          setUserDetails(users);
          await convertImagesToBase64(users);
        } else {
          throw new Error(
            response.data.internalMessage || 'Failed to fetch user details'
          );
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        message.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    const convertImagesToBase64 = async (users: UserDetails[]) => {
      const images: { [key: number]: string } = {};
      await Promise.all(
        users.map(async (user, index) => {
          if (user.profileImageUrl) {
            try {
              const response = await fetch(user.profileImageUrl);
              if (!response.ok) throw new Error('Image fetch failed');

              const blob = await response.blob();
              const reader = new FileReader();
              reader.onloadend = () => {
                images[index] = reader.result as string;
                setBase64Images((prev) => ({ ...prev, ...images }));
              };
              reader.readAsDataURL(blob);
            } catch (error) {
              console.error(
                `Error converting image for user at index ${index}:`,
                error
              );
            }
          }
        })
      );
    };

    fetchUserDetails();
  }, []);

  const handleDownload = async () => {
    const resumeContent = document.getElementById('resume-content');

    if (resumeContent) {
      const buttons = document.querySelector(
        '.button-container'
      ) as HTMLElement;
      const templateSelector = document.querySelector(
        '.template-selection'
      ) as HTMLElement;

      if (buttons && templateSelector) {
        buttons.style.display = 'none';
        templateSelector.style.display = 'none';
      }

      // Set styling for the content
      resumeContent.style.visibility = 'visible';
      resumeContent.style.position = 'relative';
      resumeContent.style.width = '210mm'; // Adjusted width for content
      resumeContent.style.height = '297mm';
      resumeContent.style.overflow = 'auto';

      const pdfOptions = {
        margin: 5,
        filename: 'resume.pdf',
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      try {
        // Capture the content using html2canvas
        const canvas = await html2canvas(resumeContent, pdfOptions.html2canvas);
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = 210; // A4 page width in mm
        const pageHeight = 297; // A4 page height in mm
        const margin = pdfOptions.margin;
        const imgWidth =
          canvas.width * (pdfOptions.jsPDF.unit === 'mm' ? 25.4 / 96 : 1); // Convert canvas width to mm
        const imgHeight =
          canvas.height * (pdfOptions.jsPDF.unit === 'mm' ? 25.4 / 96 : 1); // Convert canvas height to mm

        // Create a new jsPDF instance
        const pdf = new jsPDF(
          pdfOptions.jsPDF.orientation as 'p' | 'l',
          pdfOptions.jsPDF.unit as 'mm',
          pdfOptions.jsPDF.format as 'a4'
        );

        // Calculate scale factor to fit content within the A4 page
        const scaleFactor = Math.min(
          (pageWidth - margin * 2) / imgWidth,
          (pageHeight - margin * 2) / imgHeight
        );

        // Adjust dimensions based on scale factor
        const scaledImgWidth = imgWidth * scaleFactor;
        const scaledImgHeight = imgHeight * scaleFactor;

        let positionY = margin;

        while (positionY < scaledImgHeight) {
          // Add image to PDF
          pdf.addImage(
            imgData,
            'PNG',
            margin,
            positionY,
            scaledImgWidth,
            Math.min(scaledImgHeight - positionY, pageHeight - margin * 2)
          );
          positionY += pageHeight - margin * 2; // Move to the next page

          if (positionY < scaledImgHeight) {
            pdf.addPage(); // Add a new page if there's more content
          }
        }

        // Save the PDF with the provided filename
        pdf.save(pdfOptions.filename);
        console.log('PDF saved successfully.');
      } catch (error) {
        console.error('Error capturing resume content:', error);
        alert('Failed to capture resume content');
      } finally {
        if (buttons && templateSelector) {
          buttons.style.display = 'block';
          templateSelector.style.display = 'block';
        }
      }
    }
  };

  const handleBack = () => {
    navigate('/preview-resume');
  };

  const renderTemplate = (
    templateNumber: number,
    user: UserDetails,
    index: number
  ) => {
    switch (templateNumber) {
      case 1:
        return (
          <Template1
            userDetails={{ ...user, profileImageUrl: base64Images[index] }}
          />
        );
      // Add other templates as needed
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
        <Button
          type="primary"
          onClick={handleDownload}
          style={{ marginRight: 8 }}
        >
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
        {/* Add other template buttons as needed */}
      </div>
      <div id="resume-content">{renderTemplates()}</div>
    </div>
  );
};

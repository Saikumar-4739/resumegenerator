import React, { useState } from 'react';
import { Card, Row, Col } from 'antd';
import Template1 from './template-1';
import Template2 from './template-2';

import "../styles/template-selector.css";
import Template3 from './template-3';

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

const TemplateSelector: React.FC<{ userDetails: UserDetails }> = ({ userDetails }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Template1');

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'Template1':
        return <Template1 userDetails={userDetails} />;
      case 'Template2':
        return <Template2 userDetails={userDetails} />;
      case 'Template3':
        return <Template3 userDetails={userDetails} />;
      default:
        return <Template1 userDetails={userDetails} />;
    }
  };

  return (
    <div className="template-selector-container">
      <Row gutter={16}>
        <Col span={8}>
          <Card
            hoverable
            className={selectedTemplate === 'Template1' ? 'selected-template' : ''}
            onClick={() => setSelectedTemplate('Template1')}
          >
            <div className="template-card-content">
              <h3>Template 1</h3>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            className={selectedTemplate === 'Template2' ? 'selected-template' : ''}
            onClick={() => setSelectedTemplate('Template2')}
          >
            <div className="template-card-content">
              <h3>Template 2</h3>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            className={selectedTemplate === 'Template3' ? 'selected-template' : ''}
            onClick={() => setSelectedTemplate('Template3')}
          >
            <div className="template-card-content">
              <h3>Template 3</h3>
            </div>
          </Card>
        </Col>
        {/* Add more cards for other templates if needed */}
      </Row>
      <div className="template-display">{renderTemplate()}</div>
    </div>
  );
};

export default TemplateSelector;

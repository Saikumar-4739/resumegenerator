import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LeftOutlined, SaveOutlined, EditOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import "./styles/experience.css";
import Title from 'antd/es/typography/Title';

interface Experience {
  objective: string;
  companyName: string;
  role: string;
  fromYear: string;
  toYear: string;
  description: string;
}

export const Experience: React.FC = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Experience[]>([]);
  const [isEditing, setIsEditing] = useState<boolean[]>([]);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchExperienceData(userId);
    } else {
      // Initialize with an empty form if userId is not present
      setForms([{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
      setIsEditing([true]);
    }
  }, [userId]);

  const fetchExperienceData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/experiences/${userId}`);

      if (response.data && Array.isArray(response.data.data)) {
        const fetchedData = response.data.data;
        if (fetchedData.length > 0) {
          setForms(fetchedData);
          setIsEditing(fetchedData.map(() => false));
        } else {
          // Handle case where no data is returned
          setForms([{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
          setIsEditing([true]);
        }
      } else {
        message.warning('No experience data found. You can add new experience entries.');
        setForms([{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
        setIsEditing([true]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      message.error(`Failed to fetch experience data. Error: ${error.message || 'Unknown error'}`);
      // Fallback to showing an empty form
      setForms([{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
      setIsEditing([true]);
    }
  };

  const handleEdit = (index: number) => {
    const updatedEditing = [...isEditing];
    updatedEditing[index] = true;
    setIsEditing(updatedEditing);
  };

  const handleSave = async (index: number) => {
    if (!userId) {
      message.error('User ID is not available.');
      return;
    }

    try {
      const experience = forms[index];
      const endpoint = `http://localhost:3023/experiences/update/${userId}`;
      const response = await axios.post(endpoint, experience);

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        const updatedEditing = [...isEditing];
        updatedEditing[index] = false;
        setIsEditing(updatedEditing);
        message.success('Experience data updated successfully.');
        fetchExperienceData(userId); // Re-fetch data to ensure all forms are updated
      } else {
        message.error(`Failed to update experience data. Unexpected server response: ${response.status}`);
      }
    } catch (error) {
      console.error('Update Error:', error);
      message.error(`Failed to save experience data. Error: ${error.message || 'Unknown error'}`);
    }
  };

  const handleFormChange = (index: number, changedValues: Partial<Experience>) => {
    const updatedForms = [...forms];
    updatedForms[index] = { ...updatedForms[index], ...changedValues };
    setForms(updatedForms);
  };

  const handleAddExperience = () => {
    setForms([...forms, { objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
    setIsEditing([...isEditing, true]);
  };

  const saveAllExperiences = async () => {
    if (!userId) {
      message.error('User ID is not available.');
      return;
    }

    try {
      const endpoint = `http://localhost:3023/experiences/${userId}`;
      await Promise.all(forms.map((experience) => axios.post(endpoint, experience)));
      message.success('All experience data saved successfully.');
      fetchExperienceData(userId); // Re-fetch data to ensure all forms are updated
    } catch (error) {
      console.error('Save Error:', error);
      message.error(`Failed to save experience data. Error: ${error.message || 'Unknown error'}`);
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      navigate('/user-form');
    } else {
      navigate('/academics');
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        {forms.length > 0 ? (
          forms.map((experience, index) => (
            <Form
              key={index}
              name={`experience-${index}`}
              layout="vertical"
              initialValues={experience}
              onValuesChange={(changedValues) => handleFormChange(index, changedValues)}
              style={{ marginBottom: '16px' }}
            >
              <Title level={4} style={{ marginTop: "20px" }}>
                Experience
              </Title>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item label="Objective" name="objective">
                    <Input.TextArea rows={4} disabled={!isEditing[index]} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Company Name" name="companyName">
                    <Input disabled={!isEditing[index]} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Role" name="role">
                    <Input disabled={!isEditing[index]} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="From Year" name="fromYear">
                    <Input disabled={!isEditing[index]} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="To Year" name="toYear">
                    <Input disabled={!isEditing[index]} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Description" name="description">
                    <Input.TextArea rows={4} disabled={!isEditing[index]} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
                  <Button
                    type="default"
                    onClick={() => handleNavigation('prev')}
                    icon={<LeftOutlined />}
                  />
                  <Button
                    type="primary"
                    onClick={() => isEditing[index] ? handleSave(index) : handleEdit(index)}
                    icon={isEditing[index] ? <SaveOutlined /> : <EditOutlined />}
                  >
                    {isEditing[index] ? 'Save' : 'Edit'}
                  </Button>
                  <Button
                    type="default"
                    onClick={() => handleNavigation('next')}
                    icon={<RightOutlined />}
                  />
                </div>
              </Form.Item>
            </Form>
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Title level={4}>No experience data available. Please add new entries.</Title>
            <Form
              name="add-experience"
              layout="vertical"
              style={{ marginTop: '16px' }}
            >
              <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
                <Button
                  type="dashed"
                  onClick={handleAddExperience}
                  icon={<PlusOutlined />}
                >
                  Add Experience
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {forms.length > 0 && (
          <Form
            name="add-another-experience"
            layout="vertical"
            style={{ marginTop: '16px' }}
          >
            <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
              <Button
                type="dashed"
                onClick={handleAddExperience}
                icon={<PlusOutlined />}
              >
                Add Another Experience
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

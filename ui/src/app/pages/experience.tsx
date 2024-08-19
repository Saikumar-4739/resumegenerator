import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LeftOutlined, SaveOutlined, EditOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchExperienceData(userId);
    } else {
      setForms([{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
      setIsEditing([false]);
    }
  }, [userId]);

  const fetchExperienceData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/experiences/${userId}`);
      if (response.data.data && response.data.data.length > 0) {
        const fetchedData = response.data.data;
        setForms(fetchedData);
        setIsEditing(fetchedData.map(() => false));
      } else {
        setForms([{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }]);
        setIsEditing([false]);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch experience data',
        className: 'custom-notification',
      });
    }
  };

  const handleEdit = (index: number) => {
    const updatedEditing = [...isEditing];
    updatedEditing[index] = true;
    setIsEditing(updatedEditing);
  };

  const handleSave = async (index: number) => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID is not available.',
        className: 'custom-notification',
      });
      return;
    }

    try {
      const experience = forms[index];
      const endpoint = `http://localhost:3023/experiences/${userId}`;
      const response = await axios.post(endpoint, experience);

      if (response.status === 200) {
        const updatedEditing = [...isEditing];
        updatedEditing[index] = false;
        setIsEditing(updatedEditing);
        notification.success({
          message: 'Success',
          description: 'Experience data updated successfully.',
          className: 'custom-notification',
        });
        fetchExperienceData(userId); // Re-fetch data to ensure all forms are updated
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to update experience data. Server response was not OK.',
          className: 'custom-notification',
        });
      }
    } catch (error) {
      console.error('Update Error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to save experience data. Please check the console for more details.',
        className: 'custom-notification',
      });
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveAllExperiences = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID is not available.',
        className: 'custom-notification',
      });
      return;
    }

    try {
      const endpoint = `http://localhost:3023/experiences/${userId}`;
      await Promise.all(forms.map((experience) => axios.post(endpoint, experience)));
      notification.success({
        message: 'Success',
        description: 'All experience data saved successfully.',
        className: 'custom-notification',
      });
      fetchExperienceData(userId); // Re-fetch data to ensure all forms are updated
    } catch (error) {
      console.error('Save Error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to save experience data. Please check the console for more details.',
        className: 'custom-notification',
      });
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      navigate('/previous-page');
    } else {
      navigate('/next-page');
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
                  >
                  </Button>
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
                  >
                  </Button>
                </div>
              </Form.Item>
            </Form>
          ))
        ) : (
          <Form
            name="empty-experience"
            layout="vertical"
            initialValues={{ objective: '', companyName: '', role: '', fromYear: '', toYear: '', description: '' }}
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="Objective" name="objective">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Company Name" name="companyName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Role" name="role">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="From Year" name="fromYear">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="To Year" name="toYear">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Description" name="description">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
              <Button
                type="dashed"
                onClick={handleAddExperience}
                icon={<PlusOutlined />}
                style={{ marginLeft: '8px' }}
              >
                Add Experience
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

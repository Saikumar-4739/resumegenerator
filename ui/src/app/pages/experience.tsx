import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LeftOutlined, SaveOutlined, EditOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

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
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaved, setIsSaved] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchExperienceData(userId);
    } else {
      setForms([{ objective: ' ' , companyName: '', role: '', fromYear: '', toYear: '', description: ' ' }]);
    }
  }, [userId]);

  const fetchExperienceData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/experiences/${userId}`);
      if (response.data.data && response.data.data[0]) {
        setForms(response.data.data);
        setIsEditing(true);
      } else {
        setForms([{objective: ' ', companyName: '', role: '', fromYear: '', toYear: '', description:' ' }]);
        setIsEditing(false);
      }
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch experience data',
        className: 'custom-notification'
      });
    }
  };

  const handlePrevious = () => {
    navigate('/user-form');
  };

  const handleNextSection = () => {
    navigate('/academics');
  };

  const saveDataToBackend = async () => {
    try {
      const endpoint = `http://localhost:3023/experiences/${userId}`;
      await axios.post(endpoint, forms);
      setIsSaved(true);
      notification.success({
        message: 'Success',
        description: 'Experience data saved successfully.',
        className: 'custom-notification',
      });
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to save experience data.',
        className: 'custom-notification',
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (index: number, changedValues: any) => {
    const updatedForms = [...forms];
    updatedForms[index] = { ...updatedForms[index], ...changedValues };
    setForms(updatedForms);
  };

  const handleAddExperience = () => {
    setForms([...forms, {objective: ' ', companyName: '', role: '', fromYear: '', toYear: '', description: ' ' }]);
    setIsEditing(true);
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        {forms.map((experience, index) => (
          <Form
            key={index}
            {...layout}
            name={`experience-${index}`}
            onValuesChange={(changedValues) => handleFormChange(index, changedValues)}
            layout="vertical"
            initialValues={experience} // Auto-fill existing data
            style={{ marginBottom: '16px' }}
          >
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label="Objective"
                  name="objective"
                  rules={[{ required: true, message: 'Please input your objective!' }]}
                >
                  <Input.TextArea rows={4} disabled={!isEditing}/>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Company Name"
                  name="companyName"
                  rules={[{ required: true, message: 'Please input your company name!' }]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: 'Please input your role!' }]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="From Year"
                  name="fromYear"
                  rules={[{ required: true, message: 'Please input your start year!' }]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="To Year"
                  name="toYear"
                  rules={[{ required: true, message: 'Please input your end year!' }]}
                >
                  <Input disabled={!isEditing} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Please input your description!' }]}
                >
                  <Input.TextArea rows={4} disabled={!isEditing}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ))}

        <Form.Item style={{ textAlign: "center" }}>
          <div className="buttons-container">
            <Button
              type="default"
              onClick={handlePrevious}
              icon={<LeftOutlined />}
              style={{ marginRight: '8px' }}
            >
            </Button>
            <Button
              type="primary"
              onClick={saveDataToBackend}
              icon={isEditing ? <EditOutlined /> : <SaveOutlined />}
              style={{ marginRight: '8px' }}
              disabled={!isEditing}
            >
              {isEditing ? 'Edit' : 'Save'}
            </Button>
            <Button
              type="default"
              onClick={handleNextSection}
              icon={<RightOutlined />}
              style={{ marginRight: '8px' }}
            >
            </Button>
            <Button
              type="dashed"
              onClick={handleAddExperience}
              icon={<PlusOutlined />}
              style={{ marginLeft: '8px' }}
            >
              Add More
            </Button>
          </div>
        </Form.Item>
      </div>
    </div>
  );
};


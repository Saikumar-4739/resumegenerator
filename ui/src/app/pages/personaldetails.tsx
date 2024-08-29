 import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, SaveOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import "./styles/personaldetails.css";


const { Option } = Select;

interface PersonalDetails {
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  maritalStatus: string;
  languagesKnown: string;
}

export const PersonalDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    maritalStatus: '',
    languagesKnown: '',
  });
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchPersonalDetails(userId);
    }
  }, [userId]);

  const fetchPersonalDetails = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/personal-details/${userId}`);
      const backendData: PersonalDetails = response.data.data[0];
      setPersonalDetails(backendData);
      form.setFieldsValue(backendData);
      setIsEditing(false);
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to retrieve personal details.',
        className: 'custom-notification',
      });
    }
  };

  const saveDataToBackend = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
        className: 'custom-notification',
      });
      return;
    }

    try {
      if (isEditing) {
        await axios.post(`http://localhost:3023/personal-details/update/${userId}`, personalDetails);
        notification.success({
          message: 'Data Updated',
          description: 'Data has been updated successfully. Click on Next Section to proceed.',
          className: 'custom-notification',
        });
      } else {
        await axios.post('http://localhost:3023/personal-details/create', personalDetails);
        notification.success({
          message: 'Data Saved',
          description: 'Data has been saved successfully. Click on Next Section to proceed.',
          className: 'custom-notification',
        });
      }
      setIsSaved(true);
      setIsEditing(false);
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to save data. Please try again.',
        className: 'custom-notification',
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handlePrevious = () => {
    navigate('/skills');
  };

  const handleNextSection = () => {
    navigate('/preview-resume');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="header">Personal Details</h1> {/* Header with class */}
      <Form
        form={form}
        name="personalDetails"
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Father's Name"
              name="fatherName"
              rules={[{ required: true, message: 'Please input your father\'s name!' }]}
            >
              <Input
                value={personalDetails.fatherName}
                onChange={(event) => setPersonalDetails({ ...personalDetails, fatherName: event.target.value })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Mother's Name"
              name="motherName"
              rules={[{ required: true, message: 'Please input your mother\'s name!' }]}
            >
              <Input
                value={personalDetails.motherName}
                onChange={(event) => setPersonalDetails({ ...personalDetails, motherName: event.target.value })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Please input your date of birth!' }]}
            >
              <Input
                value={personalDetails.dateOfBirth}
                onChange={(event) => setPersonalDetails({ ...personalDetails, dateOfBirth: event.target.value })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Marital Status"
              name="maritalStatus"
              rules={[{ required: true, message: 'Please select your marital status!' }]}
            >
              <Select
                placeholder="Select marital status"
                value={personalDetails.maritalStatus}
                onChange={(value) => setPersonalDetails({ ...personalDetails, maritalStatus: value })}
                disabled={!isEditing}
              >
                <Option value="single">Single</Option>
                <Option value="married">Married</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Languages Known"
              name="languagesKnown"
              rules={[{ required: true, message: 'Please input the languages you know!' }]}
            >
              <Input
                value={personalDetails.languagesKnown}
                onChange={(event) => setPersonalDetails({ ...personalDetails, languagesKnown: event.target.value })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="default"
            onClick={handlePrevious}
            icon={<LeftOutlined />}
            style={{ marginRight: '8px' }}
          >
          </Button>
          {isEditing ? (
            <Button
              type="primary"
              onClick={saveDataToBackend}
              icon={<SaveOutlined />}
              style={{ marginRight: '8px' }}
            >
              Save
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleEdit}
              icon={<EditOutlined />}
              style={{ marginRight: '8px' }}
            >
              Edit
            </Button>
          )}
          <Button
            type="default"
            onClick={handleNextSection}
            icon={<RightOutlined />}
          >
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

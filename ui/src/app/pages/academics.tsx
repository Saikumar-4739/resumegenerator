import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, RightOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Academics {
  institutionName: string;
  passingYear: number;
  qualification: string;
  university: string;
  percentage: number;
}

export const AddAcademicsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [academicList, setAcademicList] = useState<Academics[]>([
    {
      institutionName: '',
      passingYear: 0,
      qualification: '',
      university: '',
      percentage: 0,
    },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [userId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchAcademicData(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAcademicData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/academics/${userId}`);
      const backendData: Academics[] = response.data.data;
      setAcademicList(backendData);
      form.setFieldsValue({ academicList: backendData });
    } catch {
      notification.warning({
        message: 'Error',
        description: 'Failed to fetch academics data',
        className: 'custom-notification',
      });
    } 
  };

  const createAcademicData = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
      });
      return;
    }

    const data = { userId, academicList };
    try {
      const response = await axios.post('http://localhost:3023/academics/create', data);
      if (response.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Data saved successfully!',
          className: 'custom-notification',
        });
        setIsEditing(true); // Switch to editing mode after creation
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to save data. Server response was not OK.',
          className: 'custom-notification',
        });
      }
    } catch (error) {
      console.error('Create Error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to save data. Please check the console for more details.',
        className: 'custom-notification',
      });
    }
  };

  const updateAcademicData = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
      });
      return;
    }

    const data = { userId, academicList };
    try {
      const response = await axios.post(`http://localhost:3023/academics/update/${userId}`, data);
      if (response.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Data updated successfully!',
          className: 'custom-notification',
        });
        setIsEditing(false); // Remain in view mode after update
        fetchAcademicData(userId); // Re-fetch data to ensure all forms are updated
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to update data. Server response was not OK.',
          className: 'custom-notification',
        });
      }
    } catch (error) {
      console.error('Update Error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update data. Please check the console for more details.',
        className: 'custom-notification',
      });
    }
  };

  const handleNextSection = () => {
    navigate('/skills');
  };

  const handlePreviousSection = () => {
    navigate('/experience');
  };

  const handleSaveOrUpdate = () => {
    form.validateFields()
      .then(() => {
        // Sync form values with state
        const values = form.getFieldsValue();
        setAcademicList(values.academicList || []);
        if (isEditing) {
          updateAcademicData();
        } else {
          createAcademicData();
        }
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const handleFieldChange = (index: number, field: keyof Academics, value: unknown) => {
    const updatedList = [...academicList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setAcademicList(updatedList);
    // Update the form with the new value
    form.setFieldsValue({ academicList: updatedList });
  };

  const handleAddAcademic = () => {
    setAcademicList(prev => [
      ...prev,
      { institutionName: '', passingYear: 0, qualification: '', university: '', percentage: 0 },
    ]);
  };

  return (
    <Form
      form={form}
      name="academics"
      initialValues={{ academicList }}
      layout="vertical"
    >
      {academicList.map((academic, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Institution Name"
              name={['academicList', index, 'institutionName']}
              rules={[{ required: true, message: 'Please input your institution name!' }]}
            >
              <Input
                value={academic.institutionName}
                onChange={(event) => handleFieldChange(index, 'institutionName', event.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Passing Year"
              name={['academicList', index, 'passingYear']}
              rules={[{ required: true, message: 'Please input your passing year!' }]}
            >
              <Input
                type="number"
                value={academic.passingYear}
                onChange={(event) => handleFieldChange(index, 'passingYear', Number(event.target.value))}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Qualification"
              name={['academicList', index, 'qualification']}
              rules={[{ required: true, message: 'Please input your qualification!' }]}
            >
              <Input
                value={academic.qualification}
                onChange={(event) => handleFieldChange(index, 'qualification', event.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="University"
              name={['academicList', index, 'university']}
              rules={[{ required: true, message: 'Please input your university!' }]}
            >
              <Input
                value={academic.university}
                onChange={(event) => handleFieldChange(index, 'university', event.target.value)}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Percentage"
              name={['academicList', index, 'percentage']}
              rules={[{ required: true, message: 'Please input your percentage!' }]}
            >
              <Input
                type="number"
                value={academic.percentage}
                onChange={(event) => handleFieldChange(index, 'percentage', Number(event.target.value))}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>
      ))}
      <Form.Item style={{ textAlign: "center" }}>
        <Button
          type="default"
          onClick={handlePreviousSection}
          icon={<LeftOutlined />}
          style={{ marginRight: '10px' }}
        >
        </Button>
        <Button
          type="primary"
          onClick={handleSaveOrUpdate}
          icon={<SaveOutlined />}
          style={{ marginRight: '10px' }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
        <Button
          type="default"
          onClick={handleNextSection}
          icon={<RightOutlined />}
        >
        </Button>
        <Button
          type="dashed"
          onClick={handleAddAcademic}
          icon={<PlusOutlined />}
          style={{ marginLeft: '8px' }}
        >
          Add More Qualification
        </Button>
      </Form.Item>
    </Form>
  );
};

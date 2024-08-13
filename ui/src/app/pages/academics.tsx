import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined,RightOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [academicList, setAcademicList] = useState<Academics[]>([{
    institutionName: '',
    passingYear: 0,
    qualification: '',
    university: '',
    percentage: 0,
  }]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAcademicData(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAcademicData = async (userId: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3023/academics/${userId}`);
      const backendData: Academics[] = response.data.data;
      setAcademicList(backendData);
      form.setFieldsValue({ academicList: backendData });
      setIsEditing(true);
    } catch {
      notification.warning({
        message: 'Error',
        description: 'Failed to fetch academics data',
        className: 'custom-notification',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDataInBackend = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
      });
      return;
    }

    const data = { userId, academicList };

    try {
      await axios.post('http://localhost:3023/academics/update', data);
      notification.success({
        message: 'Success',
        description: 'Data updated successfully! Click on Next Section.',
      });
      setIsEditing(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update data. Please try again.',
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
    if (isEditing) {
      updateDataInBackend();
    } else {
      saveDataToBackend();
    }
  };

  const saveDataToBackend = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
      });
      return;
    }

    const data = { userId, academicList };

    try {
      await axios.post('http://localhost:3023/academics/create', data);
      notification.success({
        message: 'Success',
        description: 'Data saved successfully!',
      });
      setIsEditing(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to save data. Please try again.',
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (index: number, field: keyof Academics, value: any) => {
    const updatedList = [...academicList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setAcademicList(updatedList);
  };

  const handleAddAcademic = () => {
    setAcademicList(prev => [
      ...prev,
      { institutionName: '', passingYear: 0, qualification: '', university: '', percentage: 0 }
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
                disabled={isEditing}
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
                disabled={isEditing}
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
                disabled={isEditing}
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
                disabled={isEditing}
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
                disabled={isEditing}
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
          Edit
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
          Add More
        </Button>
      </Form.Item>
    </Form>
  );
};

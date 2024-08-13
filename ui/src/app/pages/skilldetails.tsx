import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined,EditOutlined, PlusOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Skills {
  skillName: string;
  department: string;
}

export const AddSkillsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSaved, setIsSaved] = useState(false);
  const [skillsList, setSkillsList] = useState<Skills[]>([
    { skillName: '', department: '' }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchSkillsData(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSkillsData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/skills/${userId}`);
      const backendData: Skills[] = response.data.data;
      if (backendData.length > 0) {
        setSkillsList(backendData);
        form.setFieldsValue({ skillsList: backendData });
        setIsEditing(false);  // Set to false if you only want to edit when there's no data
      }
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch data',
        className: 'custom-notification'
      });
    }
  };

  const saveDataToBackend = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
      });
      return;
    }

    const data = form.getFieldsValue();

    try {
      if (isEditing) {
        await axios.put(`http://localhost:3023/skills/updateSkill/${userId}`, data);
        notification.success({
          message: 'Success',
          description: 'Skill updated successfully! Click on Next Section.',
        });
      } else {
        await axios.post('http://localhost:3023/skills/createSkill', { ...data, userId });
        notification.success({
          message: 'Success',
          description: 'Skill saved successfully! Click on Next Section.',
        });
      }
      setIsSaved(true);
      setIsEditing(false);  // Exit editing mode after saving
    } catch {
      notification.error({
        message: 'Error',
        description: 'Failed to save skill data. Please try again.',
      });
    }
  };

  const handleNextSection = () => {
      navigate('/personal-details');
    };

  const handlePreviousSection = () => {
    navigate('/academics');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Form
      form={form}
      name="skills"
      initialValues={{ skillsList }}
      layout="vertical"
    >
      {skillsList.map((skill, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col span={12}>
            <Form.Item
              label="Skill Name"
              name={['skillsList', index, 'skillName']}
              rules={[{ required: true, message: 'Please input your skill name!' }]}
            >
              <Input 
                disabled={!isEditing && skill.skillName !== ''} 
                placeholder={isEditing ? 'Enter skill name' : skill.skillName}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Department"
              name={['skillsList', index, 'department']}
              rules={[{ required: true, message: 'Please input your department!' }]}
            >
              <Input 
                disabled={!isEditing && skill.department !== ''} 
                placeholder={isEditing ? 'Enter department' : skill.department}
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
        {!isEditing && (
          <Button
            type="primary"
            onClick={handleEdit}
            icon={<EditOutlined />}
            style={{ marginRight: '10px' }}
          >
            Edit
          </Button>
        )}
        {isEditing && (
          <Button
            type="primary"
            onClick={saveDataToBackend}
            icon={<SaveOutlined />}
            style={{ marginRight: '10px' }}
          >
            Save
          </Button>
        )}
        <Button
          type="default"
          onClick={handleNextSection}
          icon={<RightOutlined />}
        >
        </Button>
        <Button
          type="dashed"
          onClick={() => setSkillsList(prev => [...prev, { skillName: '', department: '' }])}
          icon={<PlusOutlined />}
          style={{ marginLeft: '8px' }}
        >
          Add More
        </Button>
      </Form.Item>
    </Form>
  );
};


import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, EditOutlined, PlusOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Skill {
  id?: string;
  skillName: string;
  department: string;
}

export const AddSkillsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [skillsList, setSkillsList] = useState<Skill[]>([{ skillName: '', department: '' }]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchSkillsData(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchSkillsData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/skills/${userId}`);
      if (response.data && response.data.data.length > 0) {
        const backendData: Skill[] = response.data.data;
        setSkillsList(backendData);
        form.setFieldsValue({ skillsList: backendData });
      } else {
        resetSkillsList();
      }
      setIsEditing(false);
    } catch (error) {
      handleFetchError(error);
    }
  };

  const resetSkillsList = () => {
    const emptyList = [{ skillName: '', department: '' }];
    setSkillsList(emptyList);
    form.setFieldsValue({ skillsList: emptyList });
  };

  const handleFetchError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    notification.error({
      message: 'Error',
      description: `Failed to fetch skills data: ${errorMessage}`,
    });
  };

  const saveDataToBackend = async () => {
    if (!userId) {
      notification.error({
        message: 'Error',
        description: 'User ID not found. Please make sure you have saved user details.',
      });
      return;
    }

    const saveData = skillsList.map(skill => ({
      id: skill.id || undefined,
      skillName: skill.skillName,
      department: skill.department,
      userId,
    }));

    try {
      const endpoint = isEditing ? `http://localhost:3023/skills/${userId}` : 'http://localhost:3023/skills/createSkill';
      const method = isEditing ? axios.put : axios.post;

      await method(endpoint, { skills: saveData });

      notification.success({
        message: 'Success',
        description: `Skills ${isEditing ? 'updated' : 'saved'} successfully! Click on Next Section.`,
      });

      setIsEditing(false);
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleSaveError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    notification.error({
      message: 'Error',
      description: `Failed to save skill data: ${errorMessage}`,
    });
  };

  const handleEdit = () => setIsEditing(true);

  const handleNextSection = () => navigate('/personal-details');

  const handlePreviousSection = () => navigate('/academics');

  const handleAddSkill = () => {
    setSkillsList(prev => [...prev, { skillName: '', department: '' }]);
    form.setFieldsValue({ skillsList: [...skillsList, { skillName: '', department: '' }] });
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkillsList = skillsList.filter((_, i) => i !== index);
    setSkillsList(updatedSkillsList);
    form.setFieldsValue({ skillsList: updatedSkillsList });
  };

  return (
    <Form form={form} name="skills" layout="vertical">
      {skillsList.map((skill, index) => (
        <Row gutter={[16, 16]} key={index}>
          <Col span={12}>
            <Form.Item
              label="Skill Name"
              name={['skillsList', index, 'skillName']}
              rules={[{ required: true, message: 'Please input your skill name!' }]}
            >
              <Input
                disabled={!isEditing}
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
                disabled={!isEditing}
                placeholder={isEditing ? 'Enter department' : skill.department}
              />
            </Form.Item>
          </Col>
          {isEditing && (
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                type="link"
                onClick={() => handleRemoveSkill(index)}
                style={{ color: 'red' }}
              >
                Remove
              </Button>
            </Col>
          )}
        </Row>
      ))}
      <Form.Item style={{ textAlign: 'center' }}>
        <Button
          type="default"
          onClick={handlePreviousSection}
          icon={<LeftOutlined />}
          style={{ marginRight: '10px' }}
        />
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
        />
        <Button
          type="dashed"
          onClick={handleAddSkill}
          icon={<PlusOutlined />}
          style={{ marginLeft: '8px' }}
        >
          Add More
        </Button>
      </Form.Item>
    </Form>
  );
};

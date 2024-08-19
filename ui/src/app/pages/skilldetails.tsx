import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, EditOutlined, PlusOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Skill {
  id?: string; // Optional ID for existing skills
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
  }, [userId]);

  useEffect(() => {
    if (skillsList.length > 0) {
      form.setFieldsValue({ skillsList });
    }
  }, [skillsList, form]);

  const fetchSkillsData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/skills/${userId}`);
      
      if (response.status === 200) {
        const backendData: Skill[] = response.data.data || [];
        console.log('Fetched Skills Data:', backendData);

        if (backendData.length > 0) {
          setSkillsList(backendData);
        } else {
          // Handle case where no data is returned
          setSkillsList([{ skillName: '', department: '' }]);
        }
        setIsEditing(false);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch Skills Data Error:', error);
      notification.error({
        message: 'Error',
        description: `Failed to fetch skills data: ${(error as Error).message || 'Unknown error'}`,
      });
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

    const data = form.getFieldsValue();
    console.log('Data to save:', data);

    const saveData = skillsList.map(skill => ({
      id: skill.id || undefined,
      skillName: skill.skillName,
      department: skill.department,
      userId,
    }));

    try {
      if (isEditing) {
        await axios.post(`http://localhost:3023/skills/${userId}`, { skills: saveData });
        notification.success({
          message: 'Success',
          description: 'Skills updated successfully! Click on Next Section.',
        });
      } else {
        await axios.post('http://localhost:3023/skills/createSkill', { skills: saveData });
        notification.success({
          message: 'Success',
          description: 'Skills saved successfully! Click on Next Section.',
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Save Data to Backend Error:', error);
      notification.error({
        message: 'Error',
        description: `Failed to save skill data: ${(error as Error).message || 'Unknown error'}`,
      });
    }
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    setIsEditing(true);
  };

  const handleNextSection = () => {
    console.log('Next Section button clicked');
    navigate('/personal-details');
  };

  const handlePreviousSection = () => {
    console.log('Previous Section button clicked');
    navigate('/academics');
  };

  const handleAddSkill = () => {
    setSkillsList(prev => [...prev, { skillName: '', department: '' }]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(prev => prev.filter((_, i) => i !== index));
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
                disabled={!isEditing} 
                value={skill.skillName}
                placeholder="Enter skill name"
                onChange={(e) => {
                  const newSkillsList = [...skillsList];
                  newSkillsList[index].skillName = e.target.value;
                  setSkillsList(newSkillsList);
                }}
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
                value={skill.department}
                placeholder="Enter department"
                onChange={(e) => {
                  const newSkillsList = [...skillsList];
                  newSkillsList[index].department = e.target.value;
                  setSkillsList(newSkillsList);
                }}
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

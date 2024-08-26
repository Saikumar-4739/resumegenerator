import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, EditOutlined, PlusOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import "./styles/skills.css"

interface Skill {
  id?: string;
  skillName: string;
  department: string;
  isEditing?: boolean; // Track edit mode for each skill
}

export const AddSkillsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [skillsList, setSkillsList] = useState<Skill[]>([{ skillName: '', department: '', isEditing: true }]);
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
        const backendData: Skill[] = response.data.data.map((skill: Skill) => ({ ...skill, isEditing: false }));
        setSkillsList(backendData);
        form.setFieldsValue({ skillsList: backendData });
      } else {
        resetSkillsList();
      }
    } catch (error) {
      handleFetchError(error);
    }
  };

  const resetSkillsList = () => {
    const emptyList = [{ skillName: '', department: '', isEditing: true }];
    setSkillsList(emptyList);
    form.setFieldsValue({ skillsList: emptyList });
  };

  const handleFetchError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    message.error(`Failed to fetch skills data. Error: ${errorMessage}`);
  };

  const updateSkillsData = async (index: number) => {
    if (!userId) {
      message.error('User ID not found. Please make sure you have saved user details.');
      return;
    }

    const skillToUpdate = skillsList[index];
    const updateData = {
      id: skillToUpdate.id, // Ensure the skill has an id to be updated
      skillName: skillToUpdate.skillName,
      department: skillToUpdate.department,
      userId,
    };

    try {
      await axios.post(`http://localhost:3023/skills/update/${userId}`, { skills: [updateData] });

      message.success('Skill updated successfully!');

      // Update the isEditing state of the skill after successful save
      const updatedSkillsList = [...skillsList];
      updatedSkillsList[index].isEditing = false;
      setSkillsList(updatedSkillsList);

    } catch (error) {
      handleSaveError(error);
    }
  };

  const createSkillsData = async (index: number) => {
    if (!userId) {
      message.error('User ID not found. Please make sure you have saved user details.');
      return;
    }

    const skill = skillsList[index];

    try {
      await axios.post('http://localhost:3023/skills/createSkill', { skills: [skill] });

      message.success('Skill saved successfully!');

      const updatedSkillsList = [...skillsList];
      updatedSkillsList[index].isEditing = false;
      setSkillsList(updatedSkillsList);
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleSaveError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    message.error(`Failed to save skill data. Error: ${errorMessage}`);
  };

  const handleEdit = (index: number) => {
    const updatedSkillsList = [...skillsList];
    updatedSkillsList[index].isEditing = true;
    setSkillsList(updatedSkillsList);
  };

  const handleChange = (index: number, field: keyof Skill, value: string) => {
    const updatedSkillsList = [...skillsList];

    if (field === 'skillName' || field === 'department') {
      updatedSkillsList[index][field] = value;
      setSkillsList(updatedSkillsList);
      updateSkillsData(index); // Automatically trigger update API call on change
    }
  };

  const handleNextSection = () => navigate('/personal-details');

  const handlePreviousSection = () => navigate('/academics');

  const handleAddSkill = () => {
    const newSkill = { skillName: '', department: '', isEditing: true };
    const newSkillsList = [...skillsList, newSkill];
    setSkillsList(newSkillsList);
    form.setFieldsValue({ skillsList: newSkillsList });
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
                disabled={!skill.isEditing}
                value={skill.skillName}
                onChange={e => handleChange(index, 'skillName', e.target.value)}
                placeholder={skill.isEditing ? 'Enter skill name' : skill.skillName}
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
                disabled={!skill.isEditing}
                value={skill.department}
                onChange={e => handleChange(index, 'department', e.target.value)}
                placeholder={skill.isEditing ? 'Enter department' : skill.department}
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            {skill.isEditing ? (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                style={{ marginRight: '10px' }}
                onClick={() => updateSkillsData(index)}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => handleEdit(index)}
                icon={<EditOutlined />}
                style={{ marginRight: '10px' }}
              >
                Edit
              </Button>
            )}
            {skill.isEditing && (
              <Button
                type="link"
                onClick={() => handleRemoveSkill(index)}
                style={{ color: 'red' }}
              >
                Remove
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Form.Item style={{ textAlign: 'center' }}>
        <Button
          type="default"
          onClick={handlePreviousSection}
          icon={<LeftOutlined />}
          style={{ marginRight: '10px' }}
        />
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
          Add More Skills
        </Button>
      </Form.Item>
    </Form>
  );
};

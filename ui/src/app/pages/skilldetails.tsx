import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, EditOutlined, PlusOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import "./styles/skills.css";
import Cookies from 'js-cookie'

interface Skill {
  id?: string;
  skillName: string;
  department: string;
  isEditing?: boolean;
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
      const response = await axios.post(`http://localhost:3023/skills/${userId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
         'cookie_id': Cookies.get('cookie_id'),
        }});
      if (response.data?.data?.length > 0) {
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
    setSkillsList([{ skillName: '', department: '', isEditing: true }]);
    form.setFieldsValue({ skillsList: [{ skillName: '', department: '', isEditing: true }] });
  };

  const handleFetchError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    message.error(`Failed to fetch skills data. Error: ${errorMessage}`);
  };

  const updateSkill = async (index: number) => {
    if (!userId) {
      message.error('User ID not found. Please make sure you have saved user details.');
      return;
    }

    const skillToUpdate = skillsList[index];
    if (!skillToUpdate.id) {
      message.error('Skill ID not found. Cannot update skill.');
      return;
    }

    try {
      await axios.post('http://localhost:3023/skills/update', {
        skillName: skillToUpdate.skillName,
        department: skillToUpdate.department,
      });

      message.success('Skill updated successfully!');
      setSkillsList(prevSkills =>
        prevSkills.map((skill, i) =>
          i === index ? { ...skill, isEditing: false } : skill
        )
      );
    } catch (error) {
      handleSaveError(error);
    }
  };

  const createSkill = async (index: number) => {
    if (!userId) {
      message.error('User ID not found. Please make sure you have saved user details.');
      return;
    }

    const skillToCreate = skillsList[index];

    try {
      await axios.post('http://localhost:3023/skills/createSkill', {
        skillName: skillToCreate.skillName,
        department: skillToCreate.department,
        userId,
      });

      message.success('Skill created successfully!');
      setSkillsList(prevSkills =>
        prevSkills.map((skill, i) =>
          i === index ? { ...skill, isEditing: false } : skill
        )
      );
    } catch (error) {
      handleSaveError(error);
    }
  };

  const handleSaveError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    message.error(`Failed to save skill data. Error: ${errorMessage}`);
  };

  const handleEdit = (index: number) => {
    setSkillsList(prevSkills =>
      prevSkills.map((skill, i) =>
        i === index ? { ...skill, isEditing: true } : skill
      )
    );
  };

  const handleChange = (index: number, field: keyof Skill, value: string) => {
    setSkillsList(prevSkills =>
      prevSkills.map((skill, i) =>
        i === index ? { ...skill, [field]: value } : skill
      )
    );
  };

  const handleNextSection = () => navigate('/personal-details');
  const handlePreviousSection = () => navigate('/academics');

  const handleAddSkill = () => {
    setSkillsList(prevSkills => [...prevSkills, { skillName: '', department: '', isEditing: true }]);
    form.setFieldsValue({ skillsList: [...skillsList, { skillName: '', department: '', isEditing: true }] });
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(prevSkills => prevSkills.filter((_, i) => i !== index));
    form.setFieldsValue({ skillsList: skillsList.filter((_, i) => i !== index) });
  };

  return (
    <div className="form-container">
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
            <Col span={24} style={{ textAlign: 'center' }}>
              {skill.isEditing ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  style={{ marginRight: '10px' }}
                  onClick={() => skill.id ? updateSkill(index) : createSkill(index)}
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
    </div>
  );
};

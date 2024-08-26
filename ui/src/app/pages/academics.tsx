import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
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

const AddAcademicsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [academicList, setAcademicList] = useState<Academics[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchAcademicData(userId);
    }
  }, [userId]);

  const fetchAcademicData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/academics/${userId}`);
      const backendData: Academics[] = response.data.data;
      setAcademicList(backendData);
      form.setFieldsValue({ academicList: backendData });
      setIsEditingExisting(backendData.length > 0); // Set editing state based on existing data
    } catch (error) {
      message.error(`Failed to fetch academic data. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = { userId, academicList: values.academicList || [] };

      console.log('Submitting data:', data); // Debugging: Log data being sent

      if (isEditingExisting) {
        // Update existing data
        const response = await axios.post(`http://localhost:3023/academics/update/${userId}`, data);
        console.log('Update response:', response.data); // Debugging: Log response from the update request
        message.success('Data updated successfully!');
      } else {
        // Create new data
        const response = await axios.post('http://localhost:3023/academics/create', data);
        console.log('Create response:', response.data); // Debugging: Log response from the create request
        message.success('Data saved successfully!');
        setIsEditingExisting(true); // Switch to editing mode after creating
      }

      fetchAcademicData(userId); // Re-fetch data to update the form
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Save error:', error); // Debugging: Log any errors encountered
      message.error(`Failed to save data. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFieldChange = (index: number, field: keyof Academics, value: any) => {
    const updatedList = [...academicList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setAcademicList(updatedList);
    form.setFieldsValue({ academicList: updatedList });
  };

  const handleAddAcademic = () => {
    setAcademicList(prev => [
      ...prev,
      { institutionName: '', passingYear: 0, qualification: '', university: '', percentage: 0 },
    ]);
  };

  const handleNextSection = () => navigate('/skills');
  const handlePreviousSection = () => navigate('/experience');

  const toggleEditMode = () => {
    if (isEditing) {
      handleSave(); // Save changes if currently in edit mode
    } else {
      setIsEditing(true); // Enter edit mode
    }
  };

  return (
    <div>
      <h2>Academics</h2>
      <Form
        form={form}
        name="academics"
        layout="vertical"
        initialValues={{ academicList }}
      >
        {academicList.map((academic, index) => (
          <Row gutter={[16, 16]} key={index}>
            {['institutionName', 'passingYear', 'qualification', 'university', 'percentage'].map((field, i) => (
              <Col xs={24} sm={12} key={i}>
                <Form.Item
                  label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  name={['academicList', index, field]}
                  rules={[{ required: true, message: `Please input your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}!` }]}
                >
                  <Input
                    type={field === 'passingYear' || field === 'percentage' ? 'number' : 'text'}
                    value={academic[field]}
                    onChange={e => handleFieldChange(index, field as keyof Academics, field === 'passingYear' || field === 'percentage' ? Number(e.target.value) : e.target.value)}
                    disabled={!isEditing} // Disable fields when not in editing mode
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
        ))}
        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="default"
            onClick={handlePreviousSection}
            icon={<LeftOutlined />}
            style={{ marginRight: '10px' }}
          >
            Previous
          </Button>
          <Button
            type="primary"
            onClick={toggleEditMode} // Toggle edit mode or save changes
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
            Next
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
    </div>
  );
};

export default AddAcademicsForm;

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, RightOutlined, LeftOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import "./styles/academics.css";
import Cookies from 'js-cookie'

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
  const [editIndex, setEditIndex] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') ?? '';

  // Function to fetch academic data
  const fetchAcademicData = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/academics/${userId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
         'cookie_id': Cookies.get('cookie_id'),
        }});
      const backendData: Academics[] = response.data.data;
      setAcademicList(backendData);
      form.setFieldsValue({ academicList: backendData });
    } catch (error) {
      message.error(`Failed to fetch academic data. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAcademicData(userId);
    }
  }, [userId]);

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
    setEditIndex(false);
  };

  const handleSaveButtonClick = async (index) => {
    console.log("index number is = ", index);
    try {
      const values = await form.validateFields();
      console.log(values);
      const updatedItem = {...values.academicList[index],academicId: index+1};
      console.log(updatedItem);
      console.log('Updating data for index', index, ':', updatedItem);

      const response = await axios.post(`http://localhost:3023/academics/update/${userId}`, { ...updatedItem, userId });
      if (response.status === 200 || response.status === 201) {
        message.success('Data updated successfully!');
        setEditIndex(true);
        fetchAcademicData(userId); // Ensure the latest data is displayed
      } else {
        message.error(`Failed to update data. Status: ${response.status}`);
      }
    } catch (error) {
      message.error(`Failed to update data. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditButtonClick = () => {
    setEditIndex(false);
  };

  const handleCancelEdit = () => {
    setEditIndex(true);
  };

  const handlePreviousSection = () => {
    navigate('/experience');
  };

  const handleNextSection = () => {
    navigate('/skills');
  };

  return (
    <div className="academics-form">
      <h2 className='name'>Academics</h2>
      <Form
        form={form}
        name="academics"
        layout="vertical"
        autoComplete="off"
      >
        {academicList.map((academic, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <Row gutter={[16, 16]}>
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
                      disabled={editIndex}
                      autoComplete="off"
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Form.Item style={{ textAlign: 'center' }}>
              {!editIndex ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => handleSaveButtonClick(index)}
                    icon={<SaveOutlined />}
                    style={{ marginRight: '10px' }}
                  >
                    Save
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleCancelEdit}
                    style={{ marginRight: '10px' }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => handleEditButtonClick()}
                  icon={<EditOutlined />}
                >
                  Edit
                </Button>
              )}
            </Form.Item>
          </div>
        ))}

        <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            type="default"
            onClick={handlePreviousSection}
            icon={<LeftOutlined />}
            style={{ marginRight: '10px' }}
          >
            Previous
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

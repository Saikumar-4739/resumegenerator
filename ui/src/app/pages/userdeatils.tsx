import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { SaveOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/userdetails.css";
import Cookies from 'js-cookie';

const { Title } = Typography;

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface UserDetails {
  uname: string;
  email: string;
  mobileNo: string;
  address: Address[];
}

const UserDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    uname: '',
    email: '',
    mobileNo: '',
    address: [{} as Address],
  });
  const [userId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else {
      setIsVisible(true);
    }
  }, [userId]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3023/users/${userId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'cookie_id': Cookies.get('cookie_id'),
        }
      });
      const backendData: UserDetails = response.data.data[0];
      
      // Ensure address is an array
      if (!Array.isArray(backendData.address)) {
        backendData.address = [backendData.address];
      }

      setUserDetails(backendData);
      form.setFieldsValue({
        ...backendData,
        address: backendData.address
      });
      setIsEditing(false);
      setIsVisible(true);
    } catch (error) {
      message.error('Failed to retrieve user details. Initializing new user form.');
      setUserDetails({
        uname: '',
        email: '',
        mobileNo: '',
        address: [{} as Address],
      });
      form.resetFields();
      setIsVisible(true);
    }
  };

  const saveDataToBackend = async () => {
    try {
      const endpoint = isEditing
        ? `http://localhost:3023/users/updateuser/${userId}`
        : "http://localhost:3023/users/createuser";

      await axios.post(endpoint, userDetails, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'cookie_id': Cookies.get('cookie_id'),
        }
      });
      message.success(`User details have been ${isEditing ? 'updated' : 'saved'} successfully.`);
      setIsEditing(false);
      if (!userId) {
        navigate("/some-next-route");
      }
    } catch (error) {
      message.error('Failed to save data. Please try again.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleNextSection = () => {
    navigate("/experience");
  };

  const removeAddress = (index: number) => {
    setUserDetails(prevDetails => ({
      ...prevDetails,
      address: prevDetails.address.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="form-container">
      <div className="form-inner-container">
        {isVisible && (
          <Form
            form={form}
            layout="vertical"
            initialValues={userDetails}
          >
            <Title level={4} style={{ marginTop: "20px" }}>
              {userId ? "User Information" : "New User Information"}
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Full Name"
                  name="uname"
                  rules={[{ required: true, message: "Please input your full name!" }]}
                >
                  <Input
                    value={userDetails.uname}
                    onChange={(e) => setUserDetails({ ...userDetails, uname: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email!" }]}
                >
                  <Input
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Mobile Number"
                  name="mobileNo"
                  rules={[
                    { required: true, message: "Please input your mobile number!" },
                    { pattern: /^\d{10}$/, message: "Please input a valid 10-digit mobile number!" }
                  ]}
                >
                  <Input
                    value={userDetails.mobileNo}
                    onChange={(e) => setUserDetails({ ...userDetails, mobileNo: e.target.value })}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4} style={{ marginTop: "20px" }}>
              Address Information
            </Title>
            {userDetails.address.map((addr, index) => (
              <React.Fragment key={index}>
                <Title level={5} style={{ marginTop: "10px" }}>
                  Address {index + 1}
                </Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Street"
                      name={["address", index, "street"]}
                      rules={[{ required: true, message: "Please input your street!" }]}
                    >
                      <Input
                        value={addr.street}
                        onChange={(e) => {
                          const newAddress = [...userDetails.address];
                          newAddress[index] = { ...newAddress[index], street: e.target.value };
                          setUserDetails({ ...userDetails, address: newAddress });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="City"
                      name={["address", index, "city"]}
                      rules={[{ required: true, message: "Please input your city!" }]}
                    >
                      <Input
                        value={addr.city}
                        onChange={(e) => {
                          const newAddress = [...userDetails.address];
                          newAddress[index] = { ...newAddress[index], city: e.target.value };
                          setUserDetails({ ...userDetails, address: newAddress });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="State"
                      name={["address", index, "state"]}
                      rules={[{ required: true, message: "Please input your state!" }]}
                    >
                      <Input
                        value={addr.state}
                        onChange={(e) => {
                          const newAddress = [...userDetails.address];
                          newAddress[index] = { ...newAddress[index], state: e.target.value };
                          setUserDetails({ ...userDetails, address: newAddress });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Country"
                      name={["address", index, "country"]}
                      rules={[{ required: true, message: "Please input your country!" }]}
                    >
                      <Input
                        value={addr.country}
                        onChange={(e) => {
                          const newAddress = [...userDetails.address];
                          newAddress[index] = { ...newAddress[index], country: e.target.value };
                          setUserDetails({ ...userDetails, address: newAddress });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Zip Code"
                      name={["address", index, "zipcode"]}
                      rules={[{ required: true, message: "Please input your zip code!" }]}
                    >
                      <Input
                        value={addr.zipcode}
                        onChange={(e) => {
                          const newAddress = [...userDetails.address];
                          newAddress[index] = { ...newAddress[index], zipcode: e.target.value };
                          setUserDetails({ ...userDetails, address: newAddress });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {userDetails.address.length > 1 && (
                  <Button
                    type="link"
                    danger
                    onClick={() => removeAddress(index)}
                  >
                    Remove Address
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Form.Item style={{ textAlign: "center" }}>
              {isEditing ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={saveDataToBackend}
                >
                  Save
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    type="default"
                    icon={<RightOutlined />}
                    onClick={handleNextSection}
                    style={{ marginLeft: "10px" }}
                  >
                    Next
                  </Button>
                </>
              )}
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default UserDetailsForm;

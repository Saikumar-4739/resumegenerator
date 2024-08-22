/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { SaveOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

interface UserDetails {
  uname: string;
  email: string;
  mobileNo: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
}

const UserDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    uname: '',
    email: '',
    mobileNo: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
    },
  });
  const [userId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/users/${userId}`);
      const backendData: UserDetails = response.data.data[0];
      setUserDetails(backendData);
      form.setFieldsValue(backendData);
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to retrieve user details.');
    }
  };

  const saveDataToBackend = async () => {
    if (!userId) {
      message.error('User ID not found. Please make sure you have saved user details.');
      return;
    }

    try {
      const endpoint = isEditing
        ? `http://localhost:3023/users/updateuser/${userId}`
        : "http://localhost:3023/users/createuser";

      await axios.post(endpoint, userDetails);
      message.success(`User details have been ${isEditing ? 'updated' : 'saved'} successfully.`);
      setIsEditing(false);
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

  return (
    <div className="form-container">
      <Form
        form={form}
        layout="vertical"
      >
        <Title level={4} style={{ marginTop: "20px" }}>
          User Information
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Title level={4} style={{ marginTop: "20px" }}>
          Address Information
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Street"
              name={["address", "street"]}
              rules={[{ required: true, message: "Please input your street!" }]}
            >
              <Input
                value={userDetails.address.street}
                onChange={(e) => setUserDetails({
                  ...userDetails,
                  address: { ...userDetails.address, street: e.target.value }
                })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="City"
              name={["address", "city"]}
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input
                value={userDetails.address.city}
                onChange={(e) => setUserDetails({
                  ...userDetails,
                  address: { ...userDetails.address, city: e.target.value }
                })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="State"
              name={["address", "state"]}
              rules={[{ required: true, message: "Please input your state!" }]}
            >
              <Input
                value={userDetails.address.state}
                onChange={(e) => setUserDetails({
                  ...userDetails,
                  address: { ...userDetails.address, state: e.target.value }
                })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Country"
              name={["address", "country"]}
              rules={[{ required: true, message: "Please input your country!" }]}
            >
              <Input
                value={userDetails.address.country}
                onChange={(e) => setUserDetails({
                  ...userDetails,
                  address: { ...userDetails.address, country: e.target.value }
                })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Zip Code"
              name={["address", "zipcode"]}
              rules={[{ required: true, message: "Please input your zip code!" }]}
            >
              <Input
                value={userDetails.address.zipcode}
                onChange={(e) => setUserDetails({
                  ...userDetails,
                  address: { ...userDetails.address, zipcode: e.target.value }
                })}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

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
    </div>
  );
};

export default UserDetailsForm;
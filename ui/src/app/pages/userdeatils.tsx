import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { SaveOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/userdetails.css";

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
  const [isVisible, setIsVisible] = useState<boolean>(false); // State to control form visibility
  const [userDetails, setUserDetails] = useState<UserDetails>({
    uname: '',
    email: '',
    mobileNo: '',
    address: [{
      street: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
    }],
  });
  const [userId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else {
      // Initialize form for new user if no userId is present
      setIsVisible(true);
    }
  }, [userId]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await axios.post(`http://localhost:3023/users/${userId}`);
      const backendData: UserDetails = response.data.data[0];

      // Ensure address is an array
      if (!Array.isArray(backendData.address)) {
        backendData.address = [backendData.address];
      }

      setUserDetails(backendData);
      form.setFieldsValue({
        ...backendData,
        address: backendData.address[0] || { street: '', city: '', state: '', country: '', zipcode: '' }
      });
      setIsEditing(false);
      setIsVisible(true); // Show the form when data is fetched successfully
    } catch (error) {
      message.error('Failed to retrieve user details. Initializing new user form.');
      setUserDetails({
        uname: '',
        email: '',
        mobileNo: '',
        address: [{
          street: '',
          city: '',
          state: '',
          country: '',
          zipcode: '',
        }],
      });
      form.resetFields(); // Reset form fields
      setIsVisible(true); // Show the form on error as new user
    }
  };

  const saveDataToBackend = async () => {
    try {
      const endpoint = isEditing
        ? `http://localhost:3023/users/updateuser/${userId}`
        : "http://localhost:3023/users/createuser";

      // Ensure address is an array
      const updatedDetails = {
        ...userDetails,
        address: Array.isArray(userDetails.address) ? userDetails.address : [userDetails.address]
      };

      await axios.post(endpoint, updatedDetails);
      message.success(`User details have been ${isEditing ? 'updated' : 'saved'} successfully.`);
      setIsEditing(false);
      if (!userId) {
        navigate("/some-next-route"); // Redirect to another route if needed
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

  const address = userDetails.address[0] || { street: '', city: '', state: '', country: '', zipcode: '' };

  return (
    <div className="form-container">
      <div className="form-inner-container">
        {isVisible && ( // Render form only when isVisible is true
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
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Street"
                  name={["address", "street"]}
                  rules={[{ required: true, message: "Please input your street!" }]}
                >
                  <Input
                    value={address.street}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      address: [{
                        ...address,
                        street: e.target.value
                      }]
                    })}
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
                    value={address.city}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      address: [{
                        ...address,
                        city: e.target.value
                      }]
                    })}
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
                    value={address.state}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      address: [{
                        ...address,
                        state: e.target.value
                      }]
                    })}
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
                    value={address.country}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      address: [{
                        ...address,
                        country: e.target.value
                      }]
                    })}
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
                    value={address.zipcode}
                    onChange={(e) => setUserDetails({
                      ...userDetails,
                      address: [{
                        ...address,
                        zipcode: e.target.value
                      }]
                    })}
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
        )}
      </div>
    </div>
  );
};

export default UserDetailsForm;

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Typography, notification } from "antd";
import { SaveOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

export const AddUserForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>(null);

  notification.config({
    top: 50,
    duration: 3,      
  });

  const showNotification = (type: "success" | "error", message: string, description: string) => {
    notification[type]({
      message,
      description,
      className: 'small-notification',
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3023/users/${userId}`);
          const data = response.data.data[0];

          if (data) {
            const d = {
              fullName: data.uname || '',
              email: data.email || '',
              mobile: data.mobileNo || '',
              address: {
                street: data.address?.street || '',
                city: data.address?.city || '',
                state: data.address?.state || '',
                country: data.address?.country || '',
                zipcode: data.address?.zipcode || ''
              },
            };

            setFormData(d);
            form.setFieldsValue(d);
            setIsEditing(false);
          } else {
            showNotification("error", "Error", "No data found for the provided user ID.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (axios.isAxiosError(error)) {
            showNotification("error", "Error", error.response?.data?.internalMessage || "Failed to fetch user data. Please try again later.");
          } else {
            showNotification("error", "Error", "An unexpected error occurred. Please try again.");
          }
        }
      } else {
        showNotification("error", "Error", "User ID not found in local storage.");
      }
    };

    fetchUserData();
  }, [form]);

  const handleNextSection = () => {
    navigate("/experience");
  };

  const onFinish = async (values: any) => {
    if (!values.address || !Object.values(values.address).every(Boolean)) {
      showNotification("error", "Validation Error", "Please complete all address fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isEditing 
        ? `http://localhost:3023/users/updateuser/${localStorage.getItem("userId")}`
        : "http://localhost:3023/users/createuser";

      const { data } = await axios.post(endpoint, values);

      if (data.status) {
        if (!isEditing) {
          localStorage.setItem("userId", data.data.userId);
        }
        showNotification("success", "Data Saved", "Data has been saved successfully. Click on the next section to proceed.");
        setIsEditing(false);
        form.setFieldsValue(values);
      } else {
        showNotification("error", "Error", data.internalMessage || "Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      if (axios.isAxiosError(error)) {
        showNotification("error", "Error", error.response?.data?.internalMessage || "Failed to save data. Please try again later.");
      } else {
        showNotification("error", "Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="form-container">
      <Form
        form={form}
        onFinish={onFinish}
        className="custom-form"
        layout="vertical"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mobile Number"
              name="mobile"
              rules={[
                { required: true, message: "Please input your mobile number!" },
                { pattern: /^\d{10}$/, message: "Please input a valid 10-digit mobile number!" }
              ]}
            >
              <Input type="tel" disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>
        <Title level={4} style={{ marginTop: "20px" }}>Address Information</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Street"
              name={["address", "street"]}
              rules={[{ required: true, message: "Please input your street!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="City"
              name={["address", "city"]}
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="State"
              name={["address", "state"]}
              rules={[{ required: true, message: "Please input your state!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Country"
              name={["address", "country"]}
              rules={[{ required: true, message: "Please input your country!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Zip Code"
              name={["address", "zipcode"]}
              rules={[{ required: true, message: "Please input your zip code!" }]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: "center" }}>
          {isEditing ? (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
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

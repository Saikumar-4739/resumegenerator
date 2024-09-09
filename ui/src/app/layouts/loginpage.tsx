import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Modal } from 'antd';
import axios from 'axios';
import "../styles/loginpage.css"; 
import { useAuth } from './authentication';

const { Title } = Typography;

const API_BASE_URL = 'http://localhost:3023/login'; // Adjust base URL if necessary

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/check`, values); // Adjust endpoint if necessary
      const { response: apiResponse, user } = response.data;

      if (apiResponse.status) {
        localStorage.setItem('user', user.username);
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('token', user.email);

        login(); // Update authentication state
        navigate('/user-form'); // Redirect to user-form after login
      } else {
        setModalMessage(apiResponse.internalMessage || 'Login failed');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setModalMessage(error.response?.data?.response?.internalMessage || 'Invalid username or password');
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/post`, values); // Adjust endpoint if necessary
      const { status, errorCode, internalMessage } = response.data;

      if (status) {
        Modal.success({
          title: 'Registration successful!',
          content: 'Please log in.',
          onOk: () => {
            setIsSignup(false);
            setLoading(false);
          }
        });
      } else {
        setModalMessage(internalMessage || 'Registration failed. Please try again.');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setModalMessage(error.response?.data?.response?.internalMessage || 'Registration failed. Please try again.');
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <Title level={2} className="heading">
          {isSignup ? 'User Signup' : 'User Login'}
        </Title>
        <Form
          name={isSignup ? "signup" : "login"}
          className="form"
          initialValues={{ remember: true }}
          onFinish={isSignup ? handleSignup : handleLogin}
        >
          {isSignup && (
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please input a valid Email!' }]}
            >
              <Input className="input-field" placeholder="Email" />
            </Form.Item>
          )}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input className="input-field" placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password className="input-field" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="button1"
              loading={loading}
            >
              {isSignup ? 'Sign up' : 'Log in'}
            </Button>
            <Button
              type="default"
              className="button2"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Back to Login' : 'Sign up'}
            </Button>
          </Form.Item>
          <Button className="button3">Forgot Password</Button>
        </Form>
        <Modal
          title="Message"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalOk}
          closable={false}
        >
          <p>{modalMessage}</p>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;

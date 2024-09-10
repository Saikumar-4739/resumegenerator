import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Modal } from 'antd';
import axios from 'axios';
import '../styles/loginpage.css';
import { useAuth } from './authentication';

const { Title } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3023/login';

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
      const response = await axios.post(`${API_BASE_URL}/check`, values, { withCredentials: true });
      const { status, internalMessage, data } = response.data;

      console.log('API Response:', response.data);

      if (status) {
        const user = data[0]; // Assuming data is an array and user info is at index 0

        // Save user details in state
        login(user); // Update authentication state with user details

        navigate('/user-form'); // Redirect after login
      } else {
        setModalMessage(internalMessage || 'Login failed');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        console.error('Error Response:', error.response.data);
        setModalMessage(error.response.data.response?.internalMessage || 'Login failed. Please try again.');
      } else {
        setModalMessage('Login failed. Please try again.');
      }
      
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/post`, values); // Updated endpoint for signup
      const { status, internalMessage } = response.data;

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

      if (error.response) {
        console.error('Error Response:', error.response.data);
        setModalMessage(error.response.data.response?.internalMessage || 'Registration failed. Please try again.');
      } else {
        setModalMessage('Registration failed. Please try again.');
      }
      
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
          name={isSignup ? 'signup' : 'login'}
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
            <Input className="input-field" placeholder={isSignup ? 'Username' : 'Email'} />
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

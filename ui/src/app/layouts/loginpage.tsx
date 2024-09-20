import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Modal, message, Spin } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/loginpage.css';
import { useAuth } from './authentication';

const { Title } = Typography;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3023';

interface LoginValues {
  username: string;
  password: string;
  email?: string; // Optional, used only for signup
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Assuming this handles authentication state
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isSessionChecked, setIsSessionChecked] = useState(false);


useEffect(() => {
    const checkSession = async () => { 
      try {
        const cookie = Cookies.get('cookie_id');
        console.log(cookie);
        console.log('inside checkSession');

        // Proceed to verify the session if the cookie exists
        const response = await axios.get(`${API_BASE_URL}/login/verify`, { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'cookie_id': cookie,
          },
        })
        console.log(response);
        
        if (response.data.isValid === 1) {
          console.log("isValid");
          navigate('/user-form'); 
        } else {
          message.error('Session timed out. Please log in.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        message.error('An error occurred while verifying the session.');
      } finally {
        setIsSessionChecked(true); // Handle errors and still show the form
        setLoading(false); // Ensure loading state is set to false after operation
      }
    };

    checkSession();
  }, [navigate]); // Remove setIsSessionChecked from dependencies if not used in effect

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login/check`, values, { withCredentials: true });
      if (response.status === 201) {
        const user = response.data.data;
        login(user); // Update authentication state with user details
        navigate('/user-form'); // Redirect to protected page
      } else {
        setModalMessage(response.data.internalMessage || 'Unexpected response format.');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setModalMessage('Login failed. Please check your credentials and try again.');
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: LoginValues) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login/signup`, values);
      if (response.data.status) {
        Modal.success({
          title: 'Registration successful!',
          content: 'Please log in.',
          onOk: () => {
            setIsSignup(false);
            setLoading(false);
          },
        });
      } else {
        setModalMessage(response.data.internalMessage || 'Registration failed. Please try again.');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setModalMessage('An error occurred during signup. Please try again later.');
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isSessionChecked) {
    return <div className="loading-container"><Spin size="large" /></div>; // Or any loading indicator
  }

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
              rules={[{ required: true, type: 'email', message: 'Please input a valid Email!' }]}>
              <Input className="input-field" placeholder="Email" />
            </Form.Item>
          )}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input className="input-field" placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password className="input-field" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="button1"
              loading={loading}
              disabled={loading}
            >
              {isSignup ? 'Sign up' : 'Log in'}
            </Button>
            <Button
              type="default"
              className="button2"
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
            >
              {isSignup ? 'Back to Login' : 'Sign up'}
            </Button>
          </Form.Item>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Modal } from 'antd';
import "../styles/loginpage.css"

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishLogin = (values: any) => {
    setLoading(true);
    const { username, password } = values;

    if (username === 'saikumarsolo2000@gmail.com' && password === 'password') {
      localStorage.setItem('token', 'dummyToken'); 
      localStorage.setItem('email', username); 
      localStorage.setItem('userId', '1'); 
      navigate('/user-form');
    } else if (username === 'saikumarummidisetti23@gmail.com' && password === 'password') {
      localStorage.setItem('token', 'dummyToken'); 
      localStorage.setItem('email', username); 
      localStorage.setItem('userId', '10'); 
      navigate('/user-form');
    } else if (username === 'dummy@gmail.com' && password === 'password') {
      localStorage.setItem('token', 'dummyToken'); 
      localStorage.setItem('email', username); 
    } else {
      setIsModalVisible(true);
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishSignup = (values: any) => {
    setLoading(true);
    // Dummy signup process
    console.log('Signup values:', values);
    Modal.success({
      title: 'Registration successful!',
      content: 'Please log in.',
      onOk: () => {
        setIsSignup(false);
        setLoading(false);
      }
    });
  };

  return (
    <div className="login-container">
      <Title level={2}>
        {isSignup ? 'User Signup' : 'User Login'}
      </Title>
      <Form
        name={isSignup ? "signup" : "login"}
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={isSignup ? onFinishSignup : onFinishLogin}
      >
        {isSignup && (
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        )}
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>  
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
            {isSignup ? 'Sign up' : 'Log in'}
          </Button>
          {!isSignup && (
            <Button type="default" className="login-form-button" onClick={() => setIsSignup(true)}>
              Sign up
            </Button>
          )}
          {isSignup && (
            <Button type="default" className="login-form-button" onClick={() => setIsSignup(false)}>
              Back to Login
            </Button>
          )}
        </Form.Item>
      </Form>
      <Modal
        title="Error"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        closable={false}
      >
        <p>Invalid username or password</p>
      </Modal>
    </div>
  );
};

export default LoginPage;

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Drawer, Grid } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  AppstoreAddOutlined,
  BookOutlined,
  SmileOutlined,
  FileDoneOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import "../styles/layout.css"

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const currentRoute = location.pathname;
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('token');

    if (!isLoggedIn && currentRoute !== '/login') {
      navigate('/login');
    }

    if (isLoggedIn && currentRoute === '/login') {
      navigate('/user-form');
    }
  }, [currentRoute, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    {
      key: "/user-form",
      icon: <UserOutlined />,
      label: <Link to="/user-form">User Form</Link>,
    },
    {
      key: "/experience",
      icon: <AppstoreAddOutlined />,
      label: <Link to="/experience">Experience</Link>,
    },
    {
      key: "/academics",
      icon: <BookOutlined />,
      label: <Link to="/academics">Academics</Link>,
    },
    {
      key: "/skills",
      icon: <SmileOutlined />,
      label: <Link to="/skills">Skills</Link>,
    },
    {
      key: "/personal-details",
      icon: <FileDoneOutlined />,
      label: <Link to="/personal-details">Personal Details</Link>,
    },
    {
      key: "/preview-resume",
      icon: <EyeOutlined />,
      label: <Link to="/preview-resume">Preview Resume</Link>,
    },
    {
      key: "/download-page",
      icon: <DownloadOutlined />,
      label: <Link to="/download-page">Download Resume</Link>,
    },
  ];

  if (currentRoute === '/login') {
    return <Outlet />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <div className="logo">Resume Generator</div>
        <div className="header-right">
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
          {!screens.md && (
            <Button type="primary" onClick={toggleDrawer} style={{ marginLeft: '1rem' }}>
              Menu
            </Button>
          )}
        </div>
      </Header>
      <Layout>
        {screens.md ? (
          <Sider width={200} className="site-layout-background">
            <Menu theme="light" mode="inline" selectedKeys={[currentRoute]} items={menuItems} />
          </Sider>
        ) : (
          <Drawer
            title="Menu"
            placement="left"
            closable
            onClose={toggleDrawer}
            open={drawerOpen}
            bodyStyle={{ padding: 0 }} // Correct usage here
          >
            <Menu theme="light" mode="inline" selectedKeys={[currentRoute]} items={menuItems} />
          </Drawer>
        )}
        <Layout style={{ padding: '0 24px', minHeight: 280 }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center', padding: '16px' }}>
            ©2024 Resume Generator. All rights reserved.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

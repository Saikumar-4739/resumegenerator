import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Grid, message } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  AppstoreAddOutlined,
  BookOutlined,
  SmileOutlined,
  FileDoneOutlined,
  EyeOutlined,
  DownloadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import '../styles/applayout.css';
import Cookies from 'js-cookie';

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3023/login';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentRoute = location.pathname;

  const handleLogout = async () => {
    try {
      // Send logout request to the server
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'cookie_id': Cookies.get('cookie_id'),
        }
       });

      // Clear local storage or authentication state
      localStorage.removeItem('token');
      
      // Redirect to the login page
      navigate('/login');
      message.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Logout failed. Please try again.');
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { key: "/user-form", icon: <UserOutlined />, label: "User Form" },
    { key: "/experience", icon: <AppstoreAddOutlined />, label: "Experience" },
    { key: "/academics", icon: <BookOutlined />, label: "Academics" },
    { key: "/skills", icon: <SmileOutlined />, label: "Skills" },
    { key: "/personal-details", icon: <FileDoneOutlined />, label: "Personal Details" },
    { key: "/image", icon: <FileDoneOutlined />, label: "Image" },
    { key: "/preview-resume", icon: <EyeOutlined />, label: "Preview Resume" },
    { key: "/download-page", icon: <DownloadOutlined />, label: "Download" },
  ];

  if (location.pathname === '/login') {
    return <Outlet />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="menu-trigger"
        />
        <div className="logo">Résumé Generator</div>
        <div className="header-right">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="logout-button"
            aria-label="Logout"
          />
          {!screens.md && (
            <Button type="primary" onClick={toggleDrawer} style={{ marginLeft: '1rem' }}>
              Menu
            </Button>
          )}
        </div>
      </Header>
      <Layout style={{ margin: 0 }}>
        {screens.md ? (
          <Sider trigger={null} collapsible collapsed={collapsed} className="site-layout-background">
            <Menu theme="dark" mode="inline" selectedKeys={[currentRoute]} items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.key}>{item.label}</Link>,
            }))} />
            <Menu theme="dark" mode="inline" selectedKeys={[currentRoute]}>
              <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu>
          </Sider>
        ) : (
          <Drawer
            title="Menu"
            placement="left"
            closable
            onClose={toggleDrawer}
            open={drawerOpen}
            styles={{ body: { padding: 0 } }} // Updated usage
          >
            <Menu theme="dark" mode="inline" selectedKeys={[currentRoute]} items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.key}>{item.label}</Link>,
            }))} />
          </Drawer>
        )}
        <Layout style={{ padding: '0 24px', marginTop: '0' }}>
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
            ©2024 Résumé Generator. All rights reserved.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

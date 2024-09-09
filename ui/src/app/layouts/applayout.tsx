import React, { useState } from 'react';
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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import "../styles/applayout.css";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentRoute = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
            <Button type="primary" onClick={toggleDrawer} style={{ marginLeft: '1rem' }}>Menu</Button>
          )}
        </div>
      </Header>
      <Layout style={{ margin: 0 }}>
        {screens.md ? (
          <Sider trigger={null} collapsible collapsed={collapsed} className="site-layout-background">
            <Menu theme="dark" mode="inline" selectedKeys={[currentRoute]}>
              {menuItems.map(item => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.key}>{item.label}</Link>
                </Menu.Item>
              ))}
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
            bodyStyle={{ padding: 0 }}
          >
            <Menu theme="dark" mode="inline" selectedKeys={[currentRoute]}>
              {menuItems.map(item => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.key}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
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

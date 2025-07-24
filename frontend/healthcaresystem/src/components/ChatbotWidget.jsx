import React, { useState } from 'react';
import { Button, Drawer, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Chatbot from '../pages/Chatbot/Chatbot';
import './ChatbotWidget.css';
import logo from '../assets/imgs/logo.png';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      {!open && (
        <Tooltip title="Trợ lý AI Sức khỏe" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon={<img src={logo} alt="logo" style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', objectFit: 'cover' }} />}
            size="large"
            className="chatbot-float-btn"
            onClick={showDrawer}
          />
        </Tooltip>
      )}
      <Drawer
        placement="right"
        onClose={closeDrawer}
        open={open}
        width={480}
        closeIcon={<CloseOutlined />}
        className="chatbot-drawer"
        bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Chatbot isWidget />
      </Drawer>
    </>
  );
};

export default ChatbotWidget; 
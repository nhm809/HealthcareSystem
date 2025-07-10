import React from 'react';
import { List, Button, Badge, Tooltip, Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckDouble, faCircle } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const NotificationDropdown = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }) => {
  return (
    <div style={{ minWidth: 370, maxWidth: 400, padding: 0 }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f7fafd'
      }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#222', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FontAwesomeIcon icon={faBell} style={{ color: '#1890ff', fontSize: 18 }} />
          Thông báo
          <Badge count={unreadCount} style={{ background: '#ff4d4f', marginLeft: 8 }} />
        </span>
        {unreadCount > 0 && (
          <Tooltip title="Đánh dấu tất cả đã đọc">
            <Button
              type="text"
              size="small"
              onClick={onMarkAllAsRead}
              style={{ color: '#52c41a', fontWeight: 500 }}
              icon={<FontAwesomeIcon icon={faCheckDouble} />}
            />
          </Tooltip>
        )}
      </div>
      <div style={{ maxHeight: 420, overflowY: 'auto', background: '#fff' }}>
        {notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ color: '#aaa' }}>Không có thông báo nào</span>}
            style={{ margin: '40px 0' }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
              <List.Item
                onClick={() => onMarkAsRead(item.notificationId)}
                style={{
                  cursor: 'pointer',
                  background: item.isRead ? '#fff' : '#e6f7ff',
                  borderLeft: item.isRead ? '4px solid transparent' : '4px solid #52c41a',
                  padding: '14px 20px',
                  transition: 'background 0.2s',
                  alignItems: 'flex-start'
                }}
                className="notification-item"
              >
                <List.Item.Meta
                  avatar={
                    !item.isRead && (
                      <FontAwesomeIcon icon={faCircle} style={{ color: '#52c41a', fontSize: 10, marginTop: 6 }} />
                    )
                  }
                  title={
                    <span style={{
                      fontWeight: item.isRead ? 400 : 700,
                      color: item.isRead ? '#333' : '#1890ff',
                      fontSize: 15
                    }}>
                      {item.title}
                    </span>
                  }
                  description={
                    <div>
                      <span style={{ color: '#666', fontSize: 13, whiteSpace: 'pre-line' }}>{item.content}</span>
                      <div style={{ color: '#bbb', fontSize: 11, marginTop: 4, display: 'flex', gap: 8 }}>
                        <span>{dayjs(item.sendTime).fromNow()}</span>
                        <span>({dayjs(item.sendTime).format('DD/MM/YYYY HH:mm')})</span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown; 
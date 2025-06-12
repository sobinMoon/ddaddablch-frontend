import React, { useState, useEffect } from 'react';
import './Notifications.css';
import SERVER_URL from '../../hooks/SeverUrl';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";

export default function Notifications({ userInfo }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/notification/all?sid=${userInfo.result.sid}`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo?.result?.sid) {
            fetchNotifications();
        }
    }, [userInfo]);

    const handleNotificationClick = (notification) => {
        switch (notification.notificationType) {
            case 'POST_COMMENT':
                navigate(`/community/post/${notification.relatedPostId}?fromPage=1`);
                break;
            case 'DONATION_COMPLETE':
                navigate(`/donate/campaign/${notification.redirectUrl}`);
                break;
            default:
                console.log('Unknown notification type:', notification.notificationType);
        }
    };

    const handleMarkAsRead = async (notificationId, e) => {
        e.stopPropagation(); // Prevent notification click event
        try {
            const response = await fetch(`${SERVER_URL}/api/v1/notification/read/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // Update the notification's read status in the list
                setNotifications(prevNotifications => 
                    prevNotifications.map(notification => 
                        notification.notificationId === notificationId 
                            ? { ...notification, isRead: true }
                            : notification
                    )
                );
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    return (
        <div className="mypage-content">
            <div className="notifications-container">
                <div className="notifications-header">
                    <h3 className="notifications-title">알림</h3>
                    <span className="notifications-count">{unreadCount}개의 새로운 알림</span>
                </div>
                
                {loading ? (
                    <div className="notifications-loading"></div>
                ) : notifications.length > 0 ? (
                    <div className="notifications-list">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.notificationId}
                                className={`notification-item ${notification.isRead ? 'notification-read' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h4 className="notification-title">{notification.title}</h4>
                                        {!notification.isRead && (
                                            <button 
                                                className="notification-read-button"
                                                onClick={(e) => handleMarkAsRead(notification.notificationId, e)}
                                            >
                                                확인
                                            </button>
                                        )}
                                    </div>
                                    <p className="notification-message">{notification.content}</p>
                                    <span className="notification-date">{formatDate(notification.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="notifications-empty">
                        알림이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
} 
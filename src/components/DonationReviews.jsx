import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonationReviews.css';

const ReviewContent = ({ title, content, onClick }) => (
    <div className="review-content" onClick={onClick} style={{ cursor: 'pointer' }}>
        <p className="review-content-title">"{title}"</p>
        <p className="review-content-text">{content}</p>
    </div>
);

const ReviewIndicators = ({ total, currentIndex }) => (
    <div className="review-indicators">
        {Array.from({ length: total }).map((_, idx) => (
            <span
                key={idx}
                className={`indicator-dot ${currentIndex === idx ? 'active' : ''}`}
            ></span>
        ))}
    </div>
);

const DonationReviews = ({ recentUpdates = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const startX = useRef(null);
    const isDragging = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (recentUpdates.length === 0) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % recentUpdates.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [recentUpdates.length]);

    const handleSwipe = (deltaX) => {
        if (recentUpdates.length === 0) return;
        
        if (deltaX > 50) {
            setCurrentIndex((prev) => (prev - 1 + recentUpdates.length) % recentUpdates.length);
        } else if (deltaX < -50) {
            setCurrentIndex((prev) => (prev + 1) % recentUpdates.length);
        }
    };

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (!startX.current) return;
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX.current;
        handleSwipe(deltaX);
        startX.current = null;
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        const endX = e.clientX;
        const deltaX = endX - startX.current;
        handleSwipe(deltaX);
        isDragging.current = false;
    };

    const handleReviewClick = () => {
        const currentUpdate = recentUpdates[currentIndex];
        navigate(`/donate/campaign/${currentUpdate.campaignId}/news`);
    };

    if (recentUpdates.length === 0) {
        return null;
    }

    const currentUpdate = recentUpdates[currentIndex];

    return (
        <div
            className="review-banner"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="review-banner-title">
                <span className="review-title-text">최근 업데이트</span>
            </div>
            <ReviewContent 
                title={currentUpdate.name} 
                content={currentUpdate.previewContent}
                onClick={handleReviewClick}
            />
            <ReviewIndicators 
                total={recentUpdates.length} 
                currentIndex={currentIndex} 
            />
        </div>
    );
};

export default DonationReviews;
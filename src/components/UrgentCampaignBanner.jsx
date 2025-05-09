import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UrgentCampaignBanner.css';

const UrgentCampaignBanner = ({ campaigns }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const bannerRef = useRef(null);
  const autoSlideTimerRef = useRef(null);

  const startAutoSlide = () => {
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
    
    autoSlideTimerRef.current = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) => 
          prevIndex === campaigns.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [campaigns.length, isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setDragDistance(0);
    if (autoSlideTimerRef.current) {
      clearInterval(autoSlideTimerRef.current);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setCurrentX(e.clientX);
    
    const newDragDistance = startX - currentX;
    setDragDistance(newDragDistance);
    
    const threshold = bannerRef.current.offsetWidth * 0.15;
    
    if (Math.abs(newDragDistance) > threshold) {
      const direction = newDragDistance > 0 ? 1 : -1;
      let newIndex = currentIndex + direction;
      
      if (newIndex < 0) {
        newIndex = campaigns.length - 1;
      } else if (newIndex >= campaigns.length) {
        newIndex = 0;
      }
      
      setCurrentIndex(newIndex);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      startAutoSlide();
    }, 1000);
  };

  const handleBannerClick = () => {
    if (!isDragging && Math.abs(dragDistance) < 5) {
      navigate(`/donate/campaign/${campaigns[currentIndex].c_id}`);
    }
  };

  return (
    <div 
      ref={bannerRef}
      className="urgent-campaign-banner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleBannerClick}
      style={{ cursor: 'pointer' }}
    >
      {campaigns.map((campaign, index) => (
        <div
          key={campaign.c_id}
          className={`campaign-slide ${index === currentIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${campaign.c_image_url})`,
          }}
        >
          <div className="campaign-overlay">
            <div className="campaign-content">
              <span className="urgent-badge">긴급 모금</span>
              <h3 className="campaign-banner-title">{campaign.c_name}</h3>
            </div>
          </div>
        </div>
      ))}
      <div className="carousel-indicators">
        <span className="indicator-text">{currentIndex + 1}/{campaigns.length}</span>
      </div>
    </div>
  );
};

export default UrgentCampaignBanner; 
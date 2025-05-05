import React, { useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import defaultImage from '../assets/dog.jpg';
import './Campaign.css';

export default function Campaign() {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='campaign-wrap'>
      <div className='left-wrap'>
        <img className='camp-img' src={defaultImage} alt="캠페인 이미지" />
        
        <div className='camp-tabs'>
          <NavLink to={`/donate/campaign/${id}`} end className='camp-tab'>캠페인 소개</NavLink>
          <NavLink to={`/donate/campaign/${id}/plan`} className='camp-tab'>사용 계획</NavLink>
          <NavLink to={`/donate/campaign/${id}/news`} className='camp-tab'>소식</NavLink>
        </div>

        <div className='tab-content'>
          <Outlet />
        </div>
      </div>

      <div className='right-wrap'>
        <p className='camp-title'>가정 폭력에서 살아남은 강아지의 행복한 내일을 위해!</p>
      </div>
    </div>
  );
}

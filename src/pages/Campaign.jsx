import React, { useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import defaultImage from '../assets/dog.jpg';
import './Campaign.css';
import Progressbar from '../components/Progressbar';
import Donatecard from '../components/Donatecard';
import Comments from '../components/Comments';
import Orgcard from '../components/Orgcard';

export default function Campaign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const onDonate = () => {
    navigate(`/donate/metamask`);
  };

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
        <Orgcard/>
        <h3 className="comment-title">댓글을 남겨 응원해주세요</h3>
        <Comments/>
      </div>

      <div className='right-wrap'>
        <p className='camp-title'>가정 폭력에서 살아남은 강아지의 행복한 내일을 위해!</p>
        <Progressbar current={420000} goal={1000000} />
        <p className='funding-period'>2025.03.06 ~ 2025.05.06</p>
        <Donatecard goal={1000000}
          remaining={1000000-420000}
          participants={243}
          onDonate={onDonate}

        />
      </div>
    </div>
  );
}

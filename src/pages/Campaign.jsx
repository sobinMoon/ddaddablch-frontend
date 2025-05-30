import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import defaultImage from '../assets/dog.jpg';
import './Campaign.css';
import Progressbar from '../components/Progressbar';
import Donatecard from '../components/Donatecard';
import Comments from '../components/Comments';
import Orgcard from '../components/Orgcard';
import DonationCompleteModal from '../components/DonationCompleteModal';
import SERVER_URL from '../hooks/SeverUrl';

export default function Campaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 임시 캠페인 데이터
  const [campaign, setCampaign] = useState({
    id: 1,
    name: "테스트 캠페인",
    description: "이것은 테스트 캠페인입니다.",
    imageUrl: defaultImage,
    goal: 10000000,
    currentAmount: 5000000,
    donateCount: 25,
    donateStart: "2024-03-01",
    donateEnd: "2024-04-01",
    organization: {
      id: 1,
      name: "테스트 단체",
      description: "테스트 단체 설명입니다.",
      imageUrl: defaultImage
    }
  });

  const [showDonationModal, setShowDonationModal] = useState(true);
  const [donationInfo, setDonationInfo] = useState({
    amount: "0.1",
    campaignName: campaign.name
  });

  // 서버 연동 부분 주석 처리
  /*
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/v1/campaigns/${id}`);
        const data = await res.json();
        if (res.ok && data.isSuccess) {
          setCampaign(data.result);
          setDonationInfo(prev => ({
            ...prev,
            campaignName: data.result.name
          }));
        } else {
          console.error('캠페인 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchCampaign();
    window.scrollTo(0, 0);
  }, [id]);
  */

  const onDonate = () => {
    navigate(`/donate/metamask-auth`, { state: { campaign } });
  };

  return (
    <div className='campaign-wrap'>
      <div className='left-wrap'>
        <img className='camp-img' src={campaign.imageUrl} alt="캠페인 이미지" />
        <div className='camp-tabs'>
          <NavLink to={`/donate/campaign/${id}`} end className='camp-tab'>캠페인 소개</NavLink>
          <NavLink to={`/donate/campaign/${id}/plan`} className='camp-tab'>사용 계획</NavLink>
          <NavLink to={`/donate/campaign/${id}/news`} className='camp-tab'>소식</NavLink>
        </div>
        <div className='tab-content'>
          <Outlet context={{ campaign }} />
        </div>
        <Orgcard organization={campaign.organization} />
        <h3 className="comment-title">댓글을 남겨 응원해주세요</h3>
        <Comments campaignId={campaign.id} />
      </div>

      <div className='right-wrap'>
        <p className='camp-title'>{campaign.name}</p>
        <Progressbar current={campaign.currentAmount} goal={campaign.goal} />
        <p className='funding-period'>{campaign.donateStart} ~ {campaign.donateEnd}</p>
        <Donatecard 
          campaignId={campaign.id}
          goal={campaign.goal}
          remaining={campaign.goal - campaign.currentAmount}
          participants={campaign.donateCount}
          onDonate={onDonate}
        />
      </div>

      <DonationCompleteModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        donationInfo={donationInfo}
      />
    </div>
  );
}

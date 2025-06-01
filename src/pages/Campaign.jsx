import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import defaultImage from '../assets/dog.jpg';
import './Campaign.css';
import Progressbar from '../components/Progressbar';
import Donatecard from '../components/Donatecard';
import Comments from '../components/Comments';
import Orgcard from '../components/Orgcard';
import SERVER_URL from '../hooks/SeverUrl';
import DonationCompleteModal from '../components/DonationCompleteModal';

export default function Campaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationInfo, setDonationInfo] = useState(null);

  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    if (location.state?.showDonationModal) {
      setShowDonationModal(true);
      setDonationInfo({
        amount: location.state.donationAmount,
        campaignName: location.state.campaignName,
        category: location.state.campaignCategory
      });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        console.log(id);
        const res = await fetch(`${SERVER_URL}/api/v1/campaigns/${id}`);

        const data = await res.json();
        if (res.ok && data.isSuccess) {
          setCampaign(data.result);
          console.log(data.result);
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

  const onDonate = () => {
    navigate(`/donate/metamask-auth`, { state: { campaign } });
  };

  if (!campaign) return <div></div>;

  return (
    <div className='campaign-wrap'>
      <DonationCompleteModal 
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        donationInfo={donationInfo}
      />
      <div className='left-wrap'>
        <img className='camp-img' src={campaign.imageUrl || defaultImage} alt="캠페인 이미지" />
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
        <Comments type="campaign" id={campaign.id} />
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
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import './Reviewlist.css';
import Reviewcard from './Reviewcard';
import SERVER_URL from '../hooks/SeverUrl';

export default function Reviewlist() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/v1/campaigns/completed`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const data = await res.json();

        if (res.ok) {
          setCampaigns(data.campaigns);
        } else {
          throw new Error(data.message || '캠페인 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="review-list"></div>;
  }

  if (error) {
    return <div className="review-list">⚠️ {error}</div>;
  }

  return (
    <div className="review-list">
      <div className="review-header">
        <h2 className='review-title'>완료된 캠페인</h2>
      </div>
      <div className="review-grid">
        {campaigns.map(campaign => (
          <Reviewcard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

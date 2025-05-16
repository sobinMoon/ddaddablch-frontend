import React from 'react' 
import './Reviewlist.css'
import mockData from '../datas/mock_campaign_data.json'; 
import Reviewcard from './Reviewcard';

export default function Reviewlist() {
  return (
    <div className="review-list">
        <div className="review-header">
            <h2 className='review-title'>완료된 캠페인</h2>
        </div>
        <div className="review-grid">
            {mockData.map(campaign => (
                <Reviewcard key={campaign.id} campaign={campaign} />
            ))}
        </div>
    </div>
  );
}

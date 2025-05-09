import React, { useState, useEffect } from 'react';
import mockData from '../datas/mock_campaign_data.json';
import Donatetab from './Donatetab';
import Campaigncard from './Campaigncard';
import './Campaignlist.css';

const categories = ['전체', '아동청소년', '노인', '환경', '동물', '장애인', '사회'];
const sortOptions = ['인기순', '최신순', '종료임박순'];

export default function Campaignlist() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOption, setSortOption] = useState('인기순');
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    let result = [...mockData];

    result = result.filter(c => c.c_status_flag === 'ACTIVE');

    if (selectedCategory !== '전체') {
      result = result.filter(c => c.c_category === selectedCategory);
    }

    switch (sortOption) {
      case '인기순':
        result.sort((a, b) => b.donate_count - a.donate_count);
        break;
      case '최신순':
        result.sort((a, b) => new Date(b.donate_start) - new Date(a.donate_start));
        break;
      case '종료임박순':
        result.sort((a, b) => new Date(a.donate_end) - new Date(b.donate_end));
        break;
      default:
        break;
    }

    setFilteredData(result);
  }, [selectedCategory, sortOption]);

  return (
    <div className="campaign-list">
      <Donatetab
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className='donate-header'>
        <h2 className='donate-title'>진행 중인 캠페인</h2>
        <div className="select-container">
          <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
            {sortOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="campaign-grid">
        {filteredData.map(c => (
          <Campaigncard key={c.c_id} campaign={c} sortOption={sortOption} />
        ))}
      </div>
    </div>
  );
}

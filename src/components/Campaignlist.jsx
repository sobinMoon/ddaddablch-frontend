import React, { useState, useEffect } from 'react';
import Donatetab from './Donatetab';
import Campaigncard from './Campaigncard';
import './Campaignlist.css';
import SERVER_URL from '../hooks/SeverUrl';
const categories = ['전체', '아동청소년', '노인', '환경', '동물', '장애인', '사회'];
const sortOptions = ['인기순', '최신순', '종료임박순'];

export default function Campaignlist() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOption, setSortOption] = useState('인기순');
  const [filteredData, setFilteredData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ API에서 캠페인 가져오기
  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/campaigns/fundraising`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //console.log(data);
        setCampaigns(data.campaigns); // ⬅️ 핵심: campaigns 배열만 저장
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  // ✅ 카테고리 및 정렬 필터링
  useEffect(() => {
    let result = [...campaigns];

    if (selectedCategory !== '전체') {
      result = result.filter(c => c.category === selectedCategory);
    }

    switch (sortOption) {
      case '인기순':
        result.sort((a, b) => b.donateCount - a.donateCount);
        break;
      case '최신순':
        result.sort((a, b) => new Date(b.donateStart) - new Date(a.donateStart));
        break;
      case '종료임박순':
        result.sort((a, b) => new Date(a.donateEnd) - new Date(b.donateEnd));
        break;
      default:
        break;
    }

    setFilteredData(result);
  }, [campaigns, selectedCategory, sortOption]);

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

      {/* ✅ 로딩/에러 처리 */}
      {loading && <p></p>}
      {error && <p style={{ color: 'red' }}>에러: {error}</p>}

      {!loading && filteredData.length === 0 ? (
        <div className="no-campaigns-message">
          {selectedCategory === '전체' 
            ? '현재 진행 중인 캠페인이 없습니다' 
            : `${selectedCategory} 카테고리의 진행 중인 캠페인이 없습니다`}
        </div>
      ) : !loading && (
        <div className="campaign-grid">
          {filteredData.map(c => (
            <Campaigncard key={c.id} campaign={c} sortOption={sortOption} />
          ))}
        </div>
      )}
    </div>
  );
}

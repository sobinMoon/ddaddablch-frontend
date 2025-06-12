import './Search.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import SERVER_URL from '../hooks/SeverUrl';
import defaultImage from '../assets/dog.jpg';
import heartImage from '../assets/cat.jpg';
import noResultsImage from '../assets/no_message.png';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchCampaigns = async () => {
            const params = new URLSearchParams(location.search);
            const keyword = params.get('q');

            if (keyword) {
                setLoading(true);
                try {
                    // 실제 API 호출
                    const response = await fetch(`${SERVER_URL}/api/v1/campaigns/search?keyword=${encodeURIComponent(keyword)}`);
                    const data = await response.json();
                    setSearchResults(data.campaigns);
                    setTotalResults(data.totalElements);
                } catch (error) {
                    console.error('검색 중 오류 발생:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        searchCampaigns();
    }, [location.search]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    return (
        <div className="search-container">
            <div className="search-wrapper">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        <IoSearchSharp />
                    </button>
                </form>

                {loading ? (
                    <div className="search-loading">검색 중...</div>
                ) : searchResults.length > 0 ? (
                    <div className="search-results">
                        <div className="search-results-header">
                            <h2>검색 결과 ({totalResults})</h2>
                        </div>
                        <div className="search-results-list">
                            {searchResults.map((campaign) => (
                                <a
                                    key={campaign.id}
                                    className="search-result-item"
                                    href={`/donate/campaign/${campaign.id}`}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <div className="campaign-image">
                                        <img
                                            src={`${SERVER_URL}/images/${campaign.imageUrl}`}
                                            alt={campaign.name}
                                        />
                                    </div>
                                    <div className="campaign-info">
                                        <h3 className="campaign-name">{campaign.name}</h3>
                                        <div className="campaign-details">
                                            <span className="campaign-category">{campaign.category}</span>
                                            <span className={
                                                "campaign-status " +
                                                (campaign.statusFlag === "FUNDRAISING"
                                                    ? "status-fundraising"
                                                    : campaign.statusFlag === "IN_PROGRESS" || campaign.statusFlag === "FUNDED"
                                                        ? "status-inprogress"
                                                        : campaign.statusFlag === "COMPLETED"
                                                            ? "status-completed"
                                                            : "")
                                            }>
                                                {campaign.statusFlag === "FUNDRAISING"
                                                    ? "진행중"
                                                    : campaign.statusFlag === "IN_PROGRESS" || campaign.statusFlag === "FUNDED"
                                                        ? "사업 진행중"
                                                        : campaign.statusFlag === "COMPLETED"
                                                            ? "종료"
                                                            : campaign.statusFlag}
                                            </span>
                                        </div>
                                        <div className="campaign-progress">
                                            <div className="progress-info">
                                                {formatAmount(campaign.currentAmount)} ETH
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : location.search && (
                    <div className="search-results">
                        <div className="no-results">
                            <img src={noResultsImage} alt="검색 결과가 없습니다." />
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
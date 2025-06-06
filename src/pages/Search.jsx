import './Search.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import SERVER_URL from '../hooks/SeverUrl';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchCampaigns = async () => {
            const params = new URLSearchParams(location.search);
            const keyword = params.get('q');
            
            if (keyword) {
                try {
                    const response = await fetch(`${SERVER_URL}/api/v1/campaigns/search?keyword=${encodeURIComponent(keyword)}`);
                    const data = await response.json();
                    console.log('검색 결과:', data);
                } catch (error) {
                    console.error('검색 중 오류 발생:', error);
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
            </div>
        </div>
    );
}
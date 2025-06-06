import './Search.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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
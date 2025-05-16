import React, { useState, useEffect } from 'react'
import Postcard from '../components/Postcard'
import './Community.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Community() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    useEffect(() => {
        const page = new URLSearchParams(location.search).get('page');
        if (page) {
            setCurrentPage(parseInt(page));
        }

        // 저장된 스크롤 위치가 있으면 복원
        const scrollPosition = sessionStorage.getItem('communityScrollPosition');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
            sessionStorage.removeItem('communityScrollPosition');
        }
    }, [location.search]);

    // Mock data
    const mockPosts = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        title: `'모두를 위한 무장애 환경 : 누구나 누리는 사회'에 기부했어요`,
        content: `'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!! 송이들도 같이 참여해요'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!! 송이들도 같이 참여해요'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!! 송이들도 같이 참여해요'모두를 위한 무장애 환경 : 누구나 누리는 사회' 모금함에 0.12315ETH 기부했어요!! 송이들도 같이 참여해요`,
        comment_count: 10,
        like_count: 10,
        created_at: '1시간 전',
        nickname: '닉네임'
    }));

    const totalPages = Math.ceil(mockPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = mockPosts.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`/community?page=${pageNumber}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 게시글 클릭 시 현재 스크롤 위치 저장
    const handlePostClick = () => {
        sessionStorage.setItem('communityScrollPosition', window.scrollY.toString());
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5; // 보여줄 페이지 번호 개수
        
        // 현재 페이지 주변의 페이지 번호 계산
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // 시작 페이지 조정
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // 이전 페이지 버튼
        if (currentPage > 1) {
            pageNumbers.push(
                <button
                    key="prev"
                    className="community-page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <FaChevronLeft size={12} />
                </button>
            );
        }

        // 첫 페이지
        if (startPage > 1) {
            pageNumbers.push(
                <button
                    key={1}
                    className="community-page-btn"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="start-ellipsis" className="community-page-ellipsis">...</span>);
            }
        }

        // 페이지 번호들
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`community-page-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // 마지막 페이지
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="end-ellipsis" className="community-page-ellipsis">...</span>);
            }
            pageNumbers.push(
                <button
                    key={totalPages}
                    className="community-page-btn"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        // 다음 페이지 버튼
        if (currentPage < totalPages) {
            pageNumbers.push(
                <button
                    key="next"
                    className="community-page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <FaChevronRight size={12} />
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div>
            <div className="community-container">
                <div className="community-header">
                    <h2 className="community-title">커뮤니티</h2>
                </div>
                <div className="community-posts">
                    {currentPosts.map((post, index) => (
                        <Postcard key={post.id} onPostClick={handlePostClick} />
                    ))}
                </div>
                <div className="community-pagination">
                    {renderPagination()}
                </div>
            </div>
        </div>
    )
}

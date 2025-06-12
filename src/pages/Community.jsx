import React, { useState, useEffect } from 'react'
import Postcard from '../components/Postcard'
import './Community.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import SERVER_URL from '../hooks/SeverUrl'

export default function Community() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    console.log(currentPage);
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({
        totalPage: 0,
        totalElements: 0,
        isFirst: true,
        isLast: false,
        listSize: 8
    });

    useEffect(() => {
        const pageParam = parseInt(new URLSearchParams(location.search).get('page'));
        if (pageParam && !isNaN(pageParam) && pageParam > 0) {
            setCurrentPage(pageParam);
        } else {
            setCurrentPage(1); // 잘못된 page 값일 경우 기본값
        }

        // 저장된 스크롤 위치가 있으면 복원
        const scrollPosition = sessionStorage.getItem('communityScrollPosition');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
            sessionStorage.removeItem('communityScrollPosition');
        }
    }, [location.search]);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/v1/posts?page=${currentPage-1}`);
                const data = await response.json();
                console.log('응답 텍스트:', data);

                if (data.isSuccess) {
                    setPosts(data.result.postList);
                    setPagination({
                        totalPage: data.result.totalPage,
                        totalElements: data.result.totalElements,
                        isFirst: data.result.isFirst,
                        isLast: data.result.isLast,
                        listSize: data.result.listSize
                    });
                }
            } catch (error) {
                console.error('게시글을 불러오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchPosts();
    }, [currentPage]);

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
        let endPage = Math.min(pagination.totalPage, startPage + maxVisiblePages - 1);

        // 시작 페이지 조정
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // 이전 페이지 버튼
        if (!pagination.isFirst) {
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
        if (endPage < pagination.totalPage) {
            if (endPage < pagination.totalPage - 1) {
                pageNumbers.push(<span key="end-ellipsis" className="community-page-ellipsis">...</span>);
            }
            pageNumbers.push(
                <button
                    key={pagination.totalPage}
                    className="community-page-btn"
                    onClick={() => handlePageChange(pagination.totalPage)}
                >
                    {pagination.totalPage}
                </button>
            );
        }

        // 다음 페이지 버튼
        if (!pagination.isLast) {
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
                    {posts.map((post) => (
                        <Postcard
                            key={post.postId}
                            post={post}
                            onPostClick={handlePostClick}
                        />
                    ))}
                </div>
                <div className="community-pagination">
                    {renderPagination()}
                </div>
            </div>
        </div>
    )
}

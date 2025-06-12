import React, { useState } from 'react';
import SERVER_URL from '../../hooks/SeverUrl';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './CreateCampaignNews.css';

export default function CreateCampaignNews() {
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const location = useLocation();

    // state로 전달된 값 꺼내기
    const campaign = location.state?.campaign;
    //console.log(campaign);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileName, setFileName] = useState('');
    const [usages, setUsages] = useState([{ description: '', amount: '' }]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setFileName(file.name);
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            alert('이미지 파일만 업로드할 수 있습니다.');
        }
    };

    const handleSubmit = async () => {
        if (!title || !content || !image) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }
        if (usages.some(usage => !usage.description || !usage.amount)) {
            alert('사용 내역을 모두 입력해주세요.');
            return;
        }

        // 사용내역 금액 총합 계산
        const totalUsageAmount = usages.reduce((sum, usage) => sum + parseFloat(usage.amount || 0), 0);
        
        // 총 기부금과 사용내역 총합 비교
        if (totalUsageAmount !== campaign.currentAmount) {
            alert(`사용내역 금액 총합(${totalUsageAmount})이 총 기부금(${campaign.currentAmount})과 일치하지 않습니다.`);
            return;
        }

        try {
            const accessToken = localStorage.getItem('token');
            if (!accessToken) {
                alert('로그인이 필요합니다.');
                return;
            }

            // JSON 데이터 생성
            const jsonData = {
                title,
                content,
                imageUrl: 'ㅁㅇㄻㄴㅇㄻㄴㄹㄴㅁㅁ', // 실제로는 이미지 업로드 후 URL을 넣거나, 필요시 입력값 사용
                spendings: usages.map(u => ({
                    title: u.description,
                    amount: parseFloat(u.amount)
                }))
            };

            const formData = new FormData();
            const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
            formData.append("request", jsonBlob);
            formData.append("image", image);
            console.log(jsonData);

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await fetch(`${SERVER_URL}/api/v1/campaigns/${campaignId}/updates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData
            });

            const result = await response.json();

            if (result.isSuccess) {
                alert('캠페인 소식이 성공적으로 등록되었습니다!');
                // 폼 초기화 등
                navigate(-1);
            } else {
                alert(result.message || '캠페인 소식 등록에 실패했습니다.');
                if (result.result) {
                    console.log('상세 에러:', result.result);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || '캠페인 소식 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="create-campaign-news-container">
            <div className="create-campaign-news-title">
                <div className='create-campaign-news-label'>소식 제목</div>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="create-campaign-news-content">
                <div className='create-campaign-news-label'>소식 내용</div>
                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="create-campaign-news-image">
                <div className='create-campaign-news-label'>대표 이미지</div>
                <div className="file-upload-wrapper">
                    {previewUrl && (
                        <img src={previewUrl} alt="미리보기" className="image-preview" />
                    )}
                    <label htmlFor="fileInput" className="custom-file-upload">
                        +
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className='create-campaign-news-total-donation'>
                <div className='create-campaign-news-label'>총 기부금</div>
                <div className='create-campaign-news-total-donation-amount'>{campaign.currentAmount}</div>

            </div>

            <div className='create-campaign-news-usage'>
                <div className='create-campaign-news-label'>사용 내역</div>
                {usages.map((usage, index) => (
                    <div key={index} className='usage-item'>
                        <input
                            type="text"
                            placeholder="사용 내역"
                            value={usage.description}
                            onChange={(e) => {
                                const newUsages = [...usages];
                                newUsages[index].description = e.target.value;
                                setUsages(newUsages);
                            }}
                        />
                        <input
                            type="text"
                            placeholder="금액 (ETH)"
                            value={usage.amount}
                            onChange={(e) => {
                                const value = e.target.value;
                                // 소수점을 포함한 숫자만 허용하는 정규식
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                    const newUsages = [...usages];
                                    newUsages[index].amount = value;
                                    setUsages(newUsages);
                                }
                            }}
                        />
                        <button
                            className="remove-usage-button"
                            onClick={() => {
                                if (usages.length === 1) {
                                    alert('최소 1개의 사용 내역은 필수입니다.');
                                    return;
                                }
                                const newUsages = usages.filter((_, i) => i !== index);
                                setUsages(newUsages);
                            }}
                        >
                            삭제
                        </button>
                    </div>
                ))}
                <button
                    className="add-usage-button"
                    onClick={() => setUsages([...usages, { description: '', amount: '' }])}
                >
                    + 항목 추가
                </button>
            </div>
            
            <button className="create-campaign-news-submit" onClick={handleSubmit}>
                등록하기
            </button>
        </div>
    );
}
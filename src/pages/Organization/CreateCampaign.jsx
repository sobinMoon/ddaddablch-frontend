import React, { useState, useEffect } from 'react';
import './CreateCampaign.css';


const categories = ['아동청소년', '노인', '환경', '동물', '장애인', '사회'];

export default function CreateCampaign() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileName, setFileName] = useState('');
    const [category, setCategory] = useState('');
    const [goal, setGoal] = useState('');
    const [plans, setPlans] = useState([{ description: '', amount: '' }]);
    const [donateStart, setDonateStart] = useState('');
    const [donateEnd, setDonateEnd] = useState('');
    const [businessStart, setBusinessStart] = useState('');
    const [businessEnd, setBusinessEnd] = useState('');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    useEffect(() => {
        setDonateStart(minDate);
    }, []);

    const handleSubmit = () => {
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        if (!donateStart || !donateEnd) {
            alert('모금 시작일과 종료일을 선택해주세요.');
            return;
        }
        if (donateStart > donateEnd) {
            alert('종료일은 시작일 이후여야 합니다.');
            return;
        }


        console.log('제출됨:', { title, content, image });

        setTitle('');
        setContent('');
        setImage(null);
        setPreviewUrl(null);
        setFileName('');
        setCategory('');
        setDonateStart('');
        setDonateEnd('');
        alert('게시글이 등록되었습니다!');
    };

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

    return (
        <div className="create-campaign-container">
            <div className="create-campaign-title">
                <div className='create-campaign-label'>캠페인 제목</div>
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="create-campaign-content">
                <div className='create-campaign-label'>캠페인 소개</div>
                <textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className='create-campaign-category'>
                <div className='create-campaign-label'>카테고리</div>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="" disabled>--</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

            </div>

            <div className="create-campaign-image">
                <div className='create-campaign-label'>대표 이미지</div>
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

            <div className='create-campaign-goal'>
                <div className='create-campaign-label'>목표 금액</div>
                <div className="input-with-unit">
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => {
                            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                            setGoal(onlyNums);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur(); // 포커스 해제
                            }
                        }}
                        placeholder='목표 금액을 입력하세요'
                    />
                    <span className="unit">ETH</span>
                </div>

            </div>


            <div className='create-campaign-plan'>
                <div className='create-campaign-label'>모금액 사용 계획</div>
                {plans.map((plan, index) => (
                    <div key={index} className='plan-item'>
                        <input
                            type="text"
                            placeholder="사용 내역"
                            value={plan.description}
                            onChange={(e) => {
                                const newPlans = [...plans];
                                newPlans[index].description = e.target.value;
                                setPlans(newPlans);
                            }}
                        />
                        <input
                            type="text"
                            placeholder="금액 (ETH)"
                            value={plan.amount}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                const newPlans = [...plans];
                                newPlans[index].amount = onlyNums;
                                setPlans(newPlans);
                            }}
                        />
                        <button
                            className="remove-plan-button"
                            onClick={() => {
                                if (plans.length === 1) {
                                    alert('최소 1개의 사용 계획은 필수입니다.');
                                    return;
                                }
                                const newPlans = plans.filter((_, i) => i !== index);
                                setPlans(newPlans);
                            }}
                        >
                            삭제
                        </button>

                    </div>
                ))}
                <button
                    className="add-plan-button"
                    onClick={() => setPlans([...plans, { description: '', amount: '' }])}
                >
                    + 항목 추가
                </button>
            </div>


            <div className='create-campaign-dates'>
                <div className='create-campaign-label'>모금 기간</div>
                <div className='date-inputs'>

                    <div className='date-input-wrapper'>
                        <input
                            type="date"
                            value={minDate}
                            onChange={(e) => setDonateStart(e.target.value)}
                            onKeyDown={(e) => e.preventDefault()}
                            min={minDate}
                            max={minDate}
                            readOnly
                        />
                    </div>
                    <span>~</span>
                    <div className='date-input-wrapper'>
                        <input
                            type="date"
                            value={donateEnd}
                            onChange={(e) => setDonateEnd(e.target.value)}
                            min={donateStart}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
            </div>

            <div className='create-campaign-dates'>
                <div className='create-campaign-label'>사업 기간</div>
                <div className='date-inputs'>
                    <div className='date-input-wrapper'>
                        <input
                            type="date"
                            value={businessStart}
                            onChange={(e) => setBusinessStart(e.target.value)}
                            min={donateEnd}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>

                    <span>~</span>
                    <div className='date-input-wrapper'>
                        <input
                            type="date"
                            value={businessEnd}
                            onChange={(e) => setBusinessEnd(e.target.value)}
                            min={businessStart}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
            </div>


            <button className="create-campaign-submit" onClick={handleSubmit}>
                등록하기
            </button>
        </div>
    );
}


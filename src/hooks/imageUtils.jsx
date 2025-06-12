import SERVER_URL from './SeverUrl';

export const fetchUserNickname = async () => {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) throw new Error('Access token not found');
  const res = await fetch(`${SERVER_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  const data = await res.json();
  return data.nickname;
};

// 이미지 존재 여부 확인 함수
const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// 가능한 이미지 경로들 시도
const tryImagePaths = async (category) => {
  const possiblePaths = [
    // 일반적인 경로들
    `/image/IMG_${category === '아동청소년' ? 'children' : 
      category === '노인' ? 'elderly' : 
      category === '환경' ? 'environment' : 
      category === '사회' ? 'social' : 
      category === '동물' ? 'animal' : 
      category === '장애인' ? 'disabled' : 'animal'}.png`,
    
    // 한글 파일명으로 된 경우
    `/image/IMG_${category}.png`,
    
    // images 폴더인 경우
    `/images/IMG_${category === '아동청소년' ? 'children' : 
      category === '노인' ? 'elderly' : 
      category === '환경' ? 'environment' : 
      category === '사회' ? 'social' : 
      category === '동물' ? 'animal' : 
      category === '장애인' ? 'disabled' : 'animal'}.png`,
    
    // src/assets 경로
    `./assets/images/IMG_${category === '아동청소년' ? 'children' : 
      category === '노인' ? 'elderly' : 
      category === '환경' ? 'environment' : 
      category === '사회' ? 'social' : 
      category === '동물' ? 'animal' : 
      category === '장애인' ? 'disabled' : 'animal'}.png`,
    
    // 기본 fallback 이미지
    '/image/IMG_animal.png',
    '/images/IMG_animal.png',
    
    // 온라인 placeholder 이미지 (최종 fallback)
    'https://via.placeholder.com/400x600/e0e0e0/333333?text=NFT+Certificate'
  ];

  for (const path of possiblePaths) {
    console.log(`이미지 경로 확인 중: ${path}`);
    const exists = await checkImageExists(path);
    if (exists) {
      console.log(`이미지 발견: ${path}`);
      return path;
    }
  }
  
  // 모든 경로 실패시 placeholder 이미지 사용
  console.warn('모든 이미지 경로 실패, placeholder 사용');
  return 'https://via.placeholder.com/400x600/e0e0e0/333333?text=NFT+Certificate';
};

export const createDonationImage = async (imageUrl, donationInfo, nickname) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('이미지 합성 시작:', { imageUrl, donationInfo, nickname });
      
      // 이미지 경로 유효성 검사 및 대안 찾기
      let validImageUrl = imageUrl;
      const imageExists = await checkImageExists(imageUrl);
      
      if (!imageExists) {
        console.warn(`원본 이미지 로드 실패: ${imageUrl}`);
        // 카테고리별 대안 이미지 찾기
        validImageUrl = await tryImagePaths(donationInfo.category);
      }

      const img = new Image();
      img.crossOrigin = "anonymous"; // 소문자로 수정
      
      img.onload = () => {
        try {
          console.log('이미지 로드 성공, 캔버스 생성 시작');
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 캔버스 크기 설정 (적절한 크기로 조정)
          canvas.width = Math.max(img.width, 400);
          canvas.height = Math.max(img.height, 600);
          
          // 배경 이미지 그리기
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // 반투명 오버레이
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(20, 20, canvas.width - 40, 360);
          
          // 테두리
          ctx.strokeStyle = '#ddd';
          ctx.lineWidth = 2;
          ctx.strokeRect(20, 20, canvas.width - 40, 360);
          
          // 텍스트 스타일링
          ctx.fillStyle = '#333';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'left';
          
          // 제목
          ctx.font = 'bold 32px Arial, sans-serif';
          ctx.fillText('🎖️ 기부 인증서', 50, 80);
          
          // 기부자명
          ctx.font = '24px Arial, sans-serif';
          ctx.fillText(`기부자: ${nickname || '익명'}님`, 50, 130);
          
          // 기부금액
          ctx.font = '20px Arial, sans-serif';
          ctx.fillText(`기부금액: ${donationInfo.amount || '0'} ETH`, 50, 170);
          
          // 카테고리
          if (donationInfo.category) {
            ctx.fillText(`카테고리: ${donationInfo.category}`, 50, 210);
          }
          
          // 캠페인명 (있는 경우)
          if (donationInfo.campaignName) {
            ctx.font = '18px Arial, sans-serif';
            ctx.fillStyle = '#666';
            // 텍스트가 너무 길면 줄바꿈
            const maxWidth = canvas.width - 100;
            const words = donationInfo.campaignName.split(' ');
            let line = '';
            let y = 250;
            
            for (let i = 0; i < words.length; i++) {
              const testLine = line + words[i] + ' ';
              const metrics = ctx.measureText(testLine);
              const testWidth = metrics.width;
              
              if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, 50, y);
                line = words[i] + ' ';
                y += 25;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, 50, y);
          }
          
          // 날짜
          const today = new Date();
          const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
          ctx.fillStyle = '#888';
          ctx.font = '16px Arial, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(formattedDate, canvas.width - 50, 340);
          
          // 고품질 이미지로 변환
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          console.log('이미지 합성 완료');
          resolve(dataUrl);
          
        } catch (canvasError) {
          console.error('캔버스 처리 중 에러:', canvasError);
          reject(canvasError);
        }
      };
      
      img.onerror = (error) => {
        console.error('이미지 로드 실패:', {
          url: validImageUrl,
          error: error,
          type: error.type,
          target: error.target
        });
        reject(new Error(`이미지 로드 실패: ${validImageUrl}`));
      };
      
      console.log('이미지 로드 시작:', validImageUrl);
      img.src = validImageUrl;
      
    } catch (error) {
      console.error('createDonationImage 전체 에러:', error);
      reject(error);
    }
  });
};
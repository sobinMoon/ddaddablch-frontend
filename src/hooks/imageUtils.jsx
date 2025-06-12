export const createDonationImage = async (imageUrl, donationInfo) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(0, 0, canvas.width, 400);
      

      // 기본 텍스트 스타일
      ctx.fillStyle = '#333';
      ctx.font = '500 65px Arial';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';

      ctx.fillText(`박은수님의 기부증서`, canvas.width / 14, 150);

      ctx.font = '60px Arial';
      ctx.fillText(`기부금 ${donationInfo.amount}ETH`, canvas.width / 14, 250);

  
      // 날짜
      const today = new Date();
      const formattedDate = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.font = '47px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(formattedDate, canvas.width / 14 * 13, 150);

      const dataUrl = canvas.toDataURL('image/jpeg');
      resolve(dataUrl);
    };

    img.onerror = reject;
    img.src = imageUrl;
  });
};

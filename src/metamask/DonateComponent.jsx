import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import contractJSON  from './contractABI.json';
const contractABI = contractJSON.abi;
import SERVER_URL from '../hooks/SeverUrl';


function DonateComponent() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [donateAmount, setDonateAmount] = useState('0.01');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const contractAddress = '0x2A916B47Bd9F6a3e8CEBb84A3133cF63c9086EE9';


  const checkBalance = async (walletAddress) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/donations/balance/0xe7dF7d281caec55aDd9a2775Def265d267BfC0B7`);
  
      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          console.error('에러:', errorData.error); // "존재하지 않는 수혜자 주소입니다."
          return null;
        } else {
          throw new Error('서버 오류');
        }
      }
  
      const data = await response.json();
      console.log('잔액 정보:', data);
      return data;
    } catch (error) {
      console.error('잔액 확인 중 에러 발생:', error);
      return null;
    }
  };
  
  // 사용 예시
  const address = '0xEbBcE5fd4E0984F749E43Bb93726D196bcf037E3';
  checkBalance(address);
  
  // 컴포넌트 마운트 시 메타마스크 연결 및 컨트랙트 초기화
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // 메타마스크 연결
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          // 컨트랙트 인스턴스 생성
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          // 플랫폼 수수료 가져오기
          const fee = await contractInstance.platformFee();
          setPlatformFee(fee.toNumber());

          setAccount(address);
          setContract(contractInstance);
        } catch (error) {
          console.error("초기화 오류:", error);
          toast.error('메타마스크 연결에 실패했습니다.');
        }
      } else {
        toast.error('메타마스크를 설치해주세요!');
      }
    };
    init();
  }, [contractAddress]);

  // 입력값 유효성 검사
  const validateInputs = () => {
    // 기부 금액 검사
    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      setValidationError('유효한 기부 금액을 입력해주세요.');
      return false;
    }

    // 수혜자 주소 검사 (필수)
    if (!beneficiaryAddress || !ethers.utils.isAddress(beneficiaryAddress)) {
      setValidationError('유효한 이더리움 주소를 입력해주세요.');
      return false;
    }

    setValidationError('');
    return true;
  };

  // 기부하기 기능
  const handleDonate = async () => {
    if (!contract || !validateInputs()) return;
    
    setLoading(true);
    try {
      const parsedAmount = ethers.utils.parseEther(donateAmount);
      
      // 스마트 컨트랙트의 donate 함수 호출
      const tx = await contract.donate(beneficiaryAddress, {
        value: parsedAmount
      });

      toast.info('기부 트랜잭션이 진행 중입니다...');
      
      // 트랜잭션 완료 대기
      await tx.wait();
      toast.success('성공적으로 기부되었습니다!');
      
      // 입력값 초기화
      setDonateAmount('0.01');
      setBeneficiaryAddress('');
    } catch (error) {
      console.error("기부 오류:", error);
      toast.error('기부 처리 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-section">
      <h2>기부하기</h2>
      
      <div className="input-group">
        <label htmlFor="donateAmount">기부 금액 (ETH)</label>
        <input
          id="donateAmount"
          type="number"
          min="0.001"
          step="0.001"
          value={donateAmount}
          onChange={(e) => setDonateAmount(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="beneficiaryAddress">수혜자 주소 (필수)</label>
        <input
          id="beneficiaryAddress"
          type="text"
          placeholder="0x..."
          value={beneficiaryAddress}
          onChange={(e) => setBeneficiaryAddress(e.target.value)}
          disabled={loading}
        />
      </div>

      {platformFee > 0 && (
        <div className="fee-info">
          <p>플랫폼 수수료: {(platformFee / 100).toFixed(2)}% ({ethers.utils.formatEther(ethers.utils.parseEther(donateAmount || '0').mul(platformFee).div(10000))} ETH)</p>
          <p>수혜자 수령액: {ethers.utils.formatEther(ethers.utils.parseEther(donateAmount || '0').mul(10000 - platformFee).div(10000))} ETH</p>
        </div>
      )}

      {validationError && (
        <p className="error-message">{validationError}</p>
      )}
      
      <button
        onClick={handleDonate}
        disabled={loading || !account}
        className={`donate-button ${loading ? 'loading' : ''}`}
      >
        {loading ? '처리 중...' : '기부하기'}
      </button>
      
      <div className="account-info">
        <p>연결된 지갑: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : '연결되지 않음'}</p>
      </div>
      
    </div>
  );
}

export default DonateComponent;
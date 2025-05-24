import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import contractJSON from './contractABI.json';
const contractABI = contractJSON.abi;
import './MetamaskDonate.css';

function MetamaskDonate() {
  const location = useLocation();
  const navigate = useNavigate();
  const campaign = location.state?.campaign;

  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [donateAmount, setDonateAmount] = useState('0.01');
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const contractAddress = '0x2fFe751D7Cc8701EB1D60E9c965f2a90FE8cc67A';

  // 지갑 연결 상태 확인 함수
  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          
          try {
            const fee = await contractInstance.platformFee();
            setPlatformFee(fee.toNumber());
          } catch (feeError) {
            console.error("수수료 정보 조회 실패:", feeError);
            setPlatformFee(0);
          }
          
          setContract(contractInstance);
        }
      } catch (error) {
        console.error("지갑 연결 확인 중 오류:", error);
        toast.error('지갑 연결 중 오류가 발생했습니다.');
      }
    }
  };

  // 컴포넌트 마운트 시 지갑 연결 확인
  useEffect(() => {
    if (!campaign) {
      navigate('/donate/campaign');
      return;
    }
    checkWalletConnection();
  }, [campaign, navigate]);

  // 메타마스크 계정 변경 감지
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const validateInputs = () => {
    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      setValidationError('유효한 기부 금액을 입력해주세요.');
      return false;
    }

    if (!campaign?.walletAddress) {
      setValidationError('수혜자 주소가 설정되지 않았습니다.');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleDonate = async () => {
    if (!contract || !validateInputs()) return;
    
    setLoading(true);
    try {
      const parsedAmount = ethers.utils.parseEther(donateAmount);
      const tx = await contract.donate(campaign.walletAddress, {
        value: parsedAmount
      });

      toast.info('기부 트랜잭션이 진행 중입니다...');
      
      await tx.wait();
      toast.success('성공적으로 기부되었습니다!');
      
      navigate(`/donate/campaign/${campaign.id}`);
    } catch (error) {
      console.error("기부 오류:", error);
      toast.error('기부 처리 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) return null;

  return (
    <div className="donate-section">
      <h2>{campaign.name} 기부하기</h2>
      
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

      <div className="beneficiary-info">
        <p className="beneficiary-label">수혜자 지갑 주소</p>
        <p className="beneficiary-address">{campaign.walletAddress}</p>
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
        <p>
          연결된 지갑: {
            account 
              ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
              : <span className="not-connected">연결되지 않음</span>
          }
        </p>
        {!account && (
          <button 
            onClick={checkWalletConnection}
            className="connect-wallet-button"
          >
            지갑 연결하기
          </button>
        )}
      </div>
    </div>
  );
}

export default MetamaskDonate;
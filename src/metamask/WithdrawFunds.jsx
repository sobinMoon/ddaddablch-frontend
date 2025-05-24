import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import contractJSON  from './contractABI.json';
const contractABI = contractJSON.abi;
import SERVER_URL from '../hooks/SeverUrl';

function WithdrawFunds({ contractAddress }) {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState('0');
  const [loading, setLoading] = useState(false);

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

          setAccount(address);
          setContract(contractInstance);

// 컨트랙트 내 잔액 조회
          const balance = await contractInstance.getBeneficiaryBalance(address);
          setContractBalance(ethers.utils.formatEther(balance));
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

  const handleWithdraw = async () => {
    if (!contract) return;

    setLoading(true);

    try {
// withdraw 함수 호출 (메타마스크 트랜잭션 발생)
      const tx = await contract.withdraw();

      toast.info('인출 요청이 처리 중입니다...');

// 트랜잭션 완료 대기
      await tx.wait();

      toast.success('기부금 인출에 성공했습니다!');

// 잔액 갱신 (인출 후 0이 되어야 함)
      const newBalance = await contract.getBeneficiaryBalance(account);
      setContractBalance(ethers.utils.formatEther(newBalance));
    } catch (error) {
      console.error("인출 오류:", error);
      toast.error('인출 처리 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-section">
      <h2>기부금 인출</h2>
      <p>인출 가능한 금액: {contractBalance} ETH</p>

      <button
        onClick={handleWithdraw}
        disabled={loading || parseFloat(contractBalance) <= 0}
        className={`withdraw-button ${parseFloat(contractBalance) <= 0 ? 'disabled' : ''}`}
      >
        {loading ? '처리 중...' : '기부금 인출하기'}
      </button>

      {parseFloat(contractBalance) <= 0 && (
        <p className="empty-balance-message">인출할 기부금이 없습니다.</p>
      )}
    </div>
  );
}

export default WithdrawFunds;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractJSON from "./contractABI.json";
const contractABI = contractJSON.abi;
import SERVER_URL from "../hooks/SeverUrl";
import "./BeneficiaryWithdraw.css";
import { useLocation } from "react-router-dom";

function BeneficiaryWithdraw() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contractBalance, setContractBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);
  const [campaignInfo, setCampaignInfo] = useState(null);
  const location = useLocation();
  const campaignId = location.state?.campaignId;
  
  // console.log(campaignId);

  // 컨트랙트 주소 (Truffle migrate 후 콘솔에 표시된 주소)
  const CONTRACT_ADDRESS = "0x6E7C4411F212f342B5e38f717a40D77166c9F2b7";

  // 캠페인 지갑 주소

  useEffect(() => {
    const fetchCampaignInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${SERVER_URL}/api/v1/campaigns/${campaignId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.isSuccess) {
          setCampaignInfo(data.result);
        }
      } catch (error) {
        console.error('캠페인 정보를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    if (campaignId) {
      fetchCampaignInfo();
    }
  }, [campaignId]);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          // 메타마스크에 연결
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // 프로바이더 설정
          const ethersProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setProvider(ethersProvider);

          // 네트워크 확인
          const network = await ethersProvider.getNetwork();
          setNetwork(network);

          // 가나슈 네트워크 확인 (체인 ID가 1337 또는 5777인지 확인)
          if (network.chainId !== 1337 && network.chainId !== 5777) {
            alert("메타마스크를 가나슈 네트워크에 연결해주세요!");
            return;
          }

          // 사용자 계정 가져오기
          const signer = ethersProvider.getSigner();
          const userAddress = await signer.getAddress();
          setAccount(userAddress);

          // 컨트랙트 인스턴스 생성
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            contractABI,
            signer
          );
          setContract(contractInstance);

          // 잔액 조회
          const balance = await contractInstance.getBeneficiaryBalance(
            userAddress
          );
          setContractBalance(ethers.utils.formatEther(balance));

          // console.log("인출 전 잔액:", contractBalance);
          // 계정 변경 이벤트 리스너
          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", () => window.location.reload());
        } catch (error) {
          console.error("메타마스크 연결 오류:", error);
          alert("메타마스크 연결에 실패했습니다: " + error.message);
        }
      } else {
        alert("메타마스크를 설치해주세요!");
      }
    };

    connectWallet();

    // 클린업 함수
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [CONTRACT_ADDRESS]);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // 메타마스크 연결 해제됨
      setAccount("");
      setContractBalance("0");
    } else {
      // 계정 변경됨
      setAccount(accounts[0]);
      if (contract) {
        const balance = await contract.getBeneficiaryBalance(accounts[0]);
        setContractBalance(ethers.utils.formatEther(balance));
      }
    }
    // 계정이 변경되면 페이지 새로고침
    window.location.reload();
  };

  // 기부금 인출 함수
  const handleWithdraw = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      // console.log("인출 시작...");

      // withdraw 함수 호출
      const tx = await contract.withdraw();
      // console.log("트랜잭션 전송됨:", tx.hash);

      // 트랜잭션 완료 대기
      alert("메타마스크에서 트랜잭션을 확인해주세요. 처리 중입니다...");
      const receipt = await tx.wait();
      // console.log("트랜잭션 완료:", receipt);

      alert("기부금 인출에 성공했습니다!");

      // 잔액 갱신
      const newBalance = await contract.getBeneficiaryBalance(account);
      setContractBalance(ethers.utils.formatEther(newBalance));
      // console.log("인출 후 잔액:", contractBalance);
    } catch (error) {
      console.error("인출 오류:", error);
      alert("인출 처리 중 오류가 발생했습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="beneficiary-withdraw-container">
      <h2 className="beneficiary-withdraw-title">
        캠페인 "{campaignInfo?.name || '로딩 중...'}" 기부금 인출
      </h2>
      
      <div className="beneficiary-withdraw-info">
        <div className="info-item">
          <span className="info-label">캠페인 지갑 주소</span>
          <span className="info-value">{campaignInfo?.walletAddress || '로딩 중...'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">연결된 지갑 주소</span>
          <span className="info-value">{account || "계정이 연결되지 않음"}</span>
        </div>
               
        <div className="info-item">
          <span className="info-label">인출 가능한 기부금</span>
          <span className="info-value balance-value">{contractBalance} ETH</span>
        </div>
      </div>

      {network && network.chainId !== 1337 && network.chainId !== 5777 && (
        <div className="network-warning">
          메타마스크를 가나슈 네트워크에 연결해주세요!
        </div>
      )}

      {/* {account && account.toLowerCase() !== CAMPAIGN_WALLET.toLowerCase() && (
        <div className="wallet-warning">
          캠페인 지갑 주소와 연결된 지갑 주소가 일치하지 않습니다.
        </div>
      )}

      {Number(contractBalance) <= 0 && (
        <p className="no-balance-message">인출할 기부금이 없습니다.</p>
      )} */}

      <div className="button-container">
        <button
          className={`withdraw-button ${loading ? 'loading' : ''}`}
          onClick={handleWithdraw}
          disabled={loading || Number(contractBalance) <= 0 || (account && campaignInfo && account.toLowerCase() !== campaignInfo.walletAddress.toLowerCase())}
        >
          {loading ? "처리 중..." : "기부금 인출하기"}
        </button>
        {!loading && (Number(contractBalance) <= 0 || (account && campaignInfo && account.toLowerCase() !== campaignInfo.walletAddress.toLowerCase())) && (
          <div className="button-tooltip">
            {Number(contractBalance) <= 0 && "인출할 기부금이 없습니다."}
            {account && campaignInfo && account.toLowerCase() !== campaignInfo.walletAddress.toLowerCase() && 
              "\n캠페인 지갑 주소와 연결된 지갑 주소가 일치하지 않습니다."}
          </div>
        )}
      </div>
    </div>
  );
}

export default BeneficiaryWithdraw;

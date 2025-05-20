import React, { useState } from "react";
import Web3 from "web3";
import "./MetaMaskAuth.css"; // CSS 분리
import SERVER_URL from '../hooks/SeverUrl';

const API_BASE_URL = `${SERVER_URL}/wallet/auth`; // 백엔드 주소

const MetaMaskAuth = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [logList, setLogList] = useState([]);
  const [stepEnabled, setStepEnabled] = useState({
    requestChallenge: false,
    sign: false,
    verify: false,
  });

  const [isConnected, setIsConnected] = useState(false);


  const log = (text) => {
    setLogList((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${text}`,
    ]);
  };


const connectWallet = async () => {
  log("메타마스크 연결 시도...");
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setIsConnected(true); // ✅ 연결 성공 표시
      log(`지갑 연결 성공: ${accounts[0]}`);
      setStepEnabled((prev) => ({ ...prev, requestChallenge: true }));
    } catch (err) {
      log(`에러: ${err.message}`);
    }
  } else {
    alert("메타마스크를 설치해주세요.");
    log("메타마스크가 설치되어 있지 않습니다.");
  }
};


  const requestChallenge = async () => {
    log("인증 요청 시도...");
    try {
      const res = await fetch(`${API_BASE_URL}/request-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "es10130813@sookmyung.ac.kr", // 실제 이메일로 교체 가능
          walletAddress,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        log(`인증 메시지 수신: ${data.message}`);
        setStepEnabled((prev) => ({ ...prev, sign: true }));
      } else {
        log(`실패: ${data.message}`);
      }
    } catch (err) {
      log(`에러: ${err.message}`);
    }
  };

  const signMessage = async () => {
    log("메시지 서명 시도...");
    try {
      const web3 = new Web3(window.ethereum);
      const signed = await web3.eth.personal.sign(message, walletAddress, "");
      setSignature(signed);
      log(`서명 완료`);
      setStepEnabled((prev) => ({ ...prev, verify: true }));
    } catch (err) {
      log(`에러: ${err.message}`);
    }
  };

  const verifySignature = async () => {
    log("서명 검증 시도...");
    try {
      const res = await fetch(`${API_BASE_URL}/verify-signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          message,
          signature,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        log("✅ 인증 성공!");
      } else {
        log("❌ 인증 실패!");
      }
    } catch (err) {
      log(`에러: ${err.message}`);
    }
  };

  return (
    <div className="metamask-auth-container">
      <h1 className="metamask-auth-title">메타마스크 지갑 인증</h1>
      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">메타마스크 연결</h2>
      <p className="metamask-auth-description">메타마스크를 통해 지갑 주소를 연결해주세요.</p>
      <button onClick={connectWallet} disabled={isConnected}>메타마스크 연결</button>
      {walletAddress &&
      <div className="metamask-connected-msg-container">
       <p className="metamask-connected-msg">✅ 지갑 주소가 연결되었어요!</p>
       {walletAddress && <p className="metamask-connected-msg-content">{walletAddress}</p>}
      </div>}
      
      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">인증 메시지 요청</h2>
      <p className="metamask-auth-description">인증을 위한 일회성 메시지를 요청해주세요.</p>
      <button onClick={requestChallenge} disabled={!stepEnabled.requestChallenge}>
        인증 요청
      </button>
      {message &&
      <div className="metamask-connected-msg-container"> 
      <p className="metamask-connected-msg">✅ 인증 메시지를 수신했어요!</p>
      <p className="metamask-connected-msg-content">받은 메시지: {message}</p>
      </div>}
      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">메시지 서명</h2>
      <p className="metamask-auth-description">메시지를 서명해주세요.</p>
      <button onClick={signMessage} disabled={!stepEnabled.sign}>
        메시지 서명
      </button>
      {signature && (
        <div className="metamask-connected-msg-container" >
          <p className="metamask-connected-msg">✅ 메시지 서명이 완료되었어요!</p>
          <p className="metamask-connected-msg-content">서명 일부: {signature.slice(0, 20)}...{signature.slice(-10)}</p>
          <p className="metamask-connected-msg-content">전체: {signature}</p>
        </div>
      )}
      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">서명 검증</h2>
      <p className="metamask-auth-description">서명을 검증해주세요.</p>
      <button onClick={verifySignature} disabled={!stepEnabled.verify}>
        서명 검증
      </button>
      <div className="divider"></div>

      <h3 className="metamask-auth-subtitle">로그</h3>
      <div className="log">
        {logList.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default MetaMaskAuth;

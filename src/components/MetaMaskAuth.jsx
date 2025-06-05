import React, { useState } from "react";
import Web3 from "web3";
import { useLocation, useNavigate } from "react-router-dom";
import "./MetaMaskAuth.css"; // CSS 분리
import SERVER_URL from "../hooks/SeverUrl";

const API_BASE_URL = `${SERVER_URL}/wallet/auth`; // 백엔드 주소

const MetaMaskAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const campaign = location.state?.campaign;

  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [authEventId, setAuthEventId] = useState(null); // ✅ AuthEvent ID 추가
  const [nonce, setNonce] = useState(""); // ✅ Nonce 추가
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
        setIsConnected(true);
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 정보를 찾을 수 없습니다.");
      }

      // 사용자 정보 가져오기
      const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.");
      }

      const userData = await userResponse.json();
      log(`사용자 정보: ${JSON.stringify(userData)}`);

      const requestBody = {
        userId: userData.id,
        walletAddress,
      };

      log(`요청 데이터: ${JSON.stringify(requestBody)}`);

      const res = await fetch(`${API_BASE_URL}/request-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();
      log(`응답 상태: ${res.status}`);
      log(`응답 데이터: ${JSON.stringify(responseData)}`);

      // ✅ HTTP 상태 코드로 성공/실패 판단
      if (res.ok) {
        // ✅ 백엔드 응답 구조에 맞게 직접 접근
        const {
          message: authMessage,
          nonce: authNonce,
          authEventId: eventId,
        } = responseData;

        if (authMessage && authNonce && eventId) {
          setMessage(authMessage);
          setNonce(authNonce);
          setAuthEventId(eventId);

          log(`✅ 인증 메시지 수신: ${authMessage}`);
          log(`✅ Nonce: ${authNonce}`);
          log(`✅ AuthEvent ID: ${eventId}`);
          setStepEnabled((prev) => ({ ...prev, sign: true }));
        } else {
          log(
            `❌ 응답 데이터가 불완전합니다: message=${authMessage}, nonce=${authNonce}, authEventId=${eventId}`
          );
        }
      } else {
        // ✅ 실패 시 응답 처리
        log(`❌ 실패: ${responseData.message || "인증 요청 실패"}`);
        alert(`인증 요청 실패: ${responseData.message || "알 수 없는 오류"}`);
      }
    } catch (err) {
      log(`❌ 에러: ${err.message}`);
      alert(`에러 발생: ${err.message}`);
    }
  };

  const signMessage = async () => {
    log("메시지 서명 시도...");
    try {
      const web3 = new Web3(window.ethereum);
      const signed = await web3.eth.personal.sign(message, walletAddress, "");
      setSignature(signed);
      log(`✅ 서명 완료: ${signed.substring(0, 20)}...`);
      setStepEnabled((prev) => ({ ...prev, verify: true }));
    } catch (err) {
      log(`❌ 서명 에러: ${err.message}`);
    }
  };

  const verifySignature = async () => {
    log("서명 검증 시도...");
    try {
      // ✅ authEventId 포함해서 요청
      const requestBody = {
        authEventId, // ✅ AuthEvent ID 추가
        walletAddress,
        message,
        signature,
      };

      log(`검증 요청 데이터: ${JSON.stringify(requestBody)}`);

      const res = await fetch(`${API_BASE_URL}/verify-signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();
      log(`검증 응답 상태: ${res.status}`);
      log(`검증 응답 데이터: ${JSON.stringify(responseData)}`);

      //
      if (res.ok && responseData.success) {
        log("✅ 인증 성공!");
        alert("인증 성공!");
        // 캠페인 페이지로 이동
        if (campaign) {
          navigate("/donate/metamask-donate", { state: { campaign } });
        } else {
          navigate("/"); // 또는 적절한 기본 페이지
        }
      } else {
        log(`❌ 인증 실패: ${responseData.message || "서명 검증 실패"}`);
        alert(
          `인증 실패: ${responseData.message || "서명 검증에 실패했습니다."}`
        );
      }
    } catch (err) {
      log(`❌ 검증 에러: ${err.message}`);
      alert(`에러 발생: ${err.message}`);
    }
  };

  // ✅ 초기화 함수 추가
  const resetAuth = () => {
    setMessage("");
    setSignature("");
    setAuthEventId(null);
    setNonce("");
    setStepEnabled({
      requestChallenge: isConnected,
      sign: false,
      verify: false,
    });
    log("🔄 인증 과정을 초기화했습니다.");
  };

  // ✅ 디버깅 함수 개선
  const debugCurrentState = () => {
    log("=== 현재 상태 디버깅 ===");
    log(`지갑 주소: ${walletAddress || "없음"}`);
    log(`메시지: ${message || "없음"}`);
    log(`AuthEvent ID: ${authEventId || "없음"}`);
    log(`Nonce: ${nonce || "없음"}`);
    log(`서명: ${signature ? signature.substring(0, 20) + "..." : "없음"}`);
    log(`단계 활성화: ${JSON.stringify(stepEnabled)}`);
  };

  return (
    <div className="metamask-auth-container">
      <h1 className="metamask-auth-title">메타마스크 지갑 인증</h1>
      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">메타마스크 연결</h2>
      <p className="metamask-auth-description">
        메타마스크를 통해 지갑 주소를 연결해주세요.
      </p>
      <button onClick={connectWallet} disabled={isConnected}>
        {isConnected ? "연결됨" : "메타마스크 연결"}
      </button>
      {walletAddress && (
        <div className="metamask-connected-msg-container">
          <p className="metamask-connected-msg">✅ 지갑 주소가 연결되었어요!</p>
          <p className="metamask-connected-msg-content">{walletAddress}</p>
        </div>
      )}

      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">인증 메시지 요청</h2>
      <p className="metamask-auth-description">
        인증을 위한 일회성 메시지를 요청해주세요.
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={requestChallenge}
          disabled={!stepEnabled.requestChallenge}
        >
          인증 요청
        </button>
        {(message || authEventId) && (
          <button
            onClick={resetAuth}
            style={{ backgroundColor: "#f0f0f0", color: "#333" }}
          >
            초기화
          </button>
        )}
        <button
          onClick={debugCurrentState}
          style={{ backgroundColor: "#e7f3ff", color: "#0066cc" }}
        >
          상태 확인
        </button>
      </div>

      {message && (
        <div className="metamask-connected-msg-container">
          <p className="metamask-connected-msg">✅ 인증 메시지를 수신했어요!</p>
          <p className="metamask-connected-msg-content">{message}</p>
          {authEventId && (
            <p className="metamask-connected-msg-content">
              AuthEvent ID: {authEventId}
            </p>
          )}
          {nonce && (
            <p className="metamask-connected-msg-content">Nonce: {nonce}</p>
          )}
        </div>
      )}

      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">메시지 서명</h2>
      <p className="metamask-auth-description">메시지를 서명해주세요.</p>
      <button onClick={signMessage} disabled={!stepEnabled.sign}>
        메시지 서명
      </button>
      {signature && (
        <div className="metamask-connected-msg-container">
          <p className="metamask-connected-msg">
            ✅ 메시지 서명이 완료되었어요!
          </p>
          <p
            className="metamask-connected-msg-content"
            style={{ wordBreak: "break-all" }}
          >
            {signature.substring(0, 50)}...
          </p>
        </div>
      )}

      <div className="divider"></div>

      <h2 className="metamask-auth-subtitle">서명 검증</h2>
      <p className="metamask-auth-description">서명을 검증해주세요.</p>
      <button onClick={verifySignature} disabled={!stepEnabled.verify}>
        서명 검증
      </button>

      <div className="divider"></div>

      {/* ✅ 현재 상태 표시 개선 */}
      <h3 className="metamask-auth-subtitle">현재 상태</h3>
      <div className="metamask-connected-msg-container">
        <p>지갑 연결: {isConnected ? "✅ 완료" : "❌ 미완료"}</p>
        <p>인증 요청: {authEventId ? "✅ 완료" : "❌ 미완료"}</p>
        <p>메시지 서명: {signature ? "✅ 완료" : "❌ 미완료"}</p>
        <p>
          다음 단계:{" "}
          {!isConnected
            ? "지갑 연결"
            : !authEventId
            ? "인증 요청"
            : !signature
            ? "메시지 서명"
            : "서명 검증"}
        </p>
      </div>

      <div className="divider"></div>

      <h3 className="metamask-auth-subtitle">로그</h3>
      <div
        className="log"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #dee2e6",
        }}
      >
        {logList.length === 0 ? (
          <div style={{ color: "#6c757d", fontStyle: "italic" }}>
            로그가 없습니다. 작업을 시작해보세요.
          </div>
        ) : (
          logList.map((entry, index) => (
            <div
              key={index}
              style={{
                marginBottom: "5px",
                fontSize: "14px",
                fontFamily: "monospace",
                color: entry.includes("✅")
                  ? "#28a745"
                  : entry.includes("❌")
                  ? "#dc3545"
                  : entry.includes("🔄")
                  ? "#17a2b8"
                  : "#333",
              }}
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MetaMaskAuth;

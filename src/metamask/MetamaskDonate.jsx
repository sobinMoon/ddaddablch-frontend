import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import contractJSON from "./contractABI.json";
const contractABI = contractJSON.abi;
import "./MetamaskDonate.css";
import SERVER_URL from "../hooks/SeverUrl";

function MetamaskDonate() {
  const location = useLocation();
  const navigate = useNavigate();
  const campaign = location.state?.campaign;

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  // ✅ 입력은 SCN, 내부 donateAmount는 ETH로 관리
  const [displayAmountSCN, setDisplayAmountSCN] = useState("10"); // 사용자 입력값 (SCN)
  const [donateAmount, setDonateAmount] = useState("0.001"); // 실제 트랜잭션 값 (ETH)

  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [provider, setProvider] = useState(null);
  const [donationStep, setDonationStep] = useState(""); // 기부 진행 단계 표시
  const contractAddress = "0xe58679beA73005880EAa3db62371bD4eCe1CE3F2";

  // 🎯 개선된 한글 카테고리 매핑 함수
  const getDonationCategoryValue = (categoryString) => {
    if (!categoryString) {
      console.warn("⚠️ 카테고리가 없음 → 기본값 5 (SOCIETY) 사용");
      return 5;
    }

    const koreanCategoryMap = {
      아동청소년: 0, // CHILDREN
      노인: 1, // ELDERLY
      환경: 2, // ENVIRONMENT
      동물: 3, // ANIMAL
      장애인: 4, // MEDICAL
      사회: 5, // SOCIETY
      전체: 5,

      노인복지: 1,
      동물보호: 3,
      의료: 4,

      CHILDREN: 0,
      ELDERLY: 1,
      ENVIRONMENT: 2,
      ANIMAL: 3,
      MEDICAL: 4,
      SOCIETY: 5,
    };

    const trimmedCategory = categoryString.toString().trim();
    if (koreanCategoryMap.hasOwnProperty(trimmedCategory)) {
      return koreanCategoryMap[trimmedCategory];
    }
    console.warn(`⚠️ 매핑 실패: "${categoryString}" → 기본값 5 (SOCIETY) 사용`);
    return 5;
  };

  // 🔍 enum 번호 → 이름 변환 (디버깅용)
  const getEnumName = (value) => {
    const enumNames = {
      0: "CHILDREN (아동청소년)",
      1: "ELDERLY (노인)",
      2: "ENVIRONMENT (환경)",
      3: "ANIMAL (동물)",
      4: "MEDICAL (장애인)",
      5: "SOCIETY (사회)",
    };
    return enumNames[value] || "UNKNOWN";
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    console.log("컨트랙트 ABI 확인:", contractABI);
    const donateFunction = contractABI.find((func) => func.name === "donate");
    console.log("donate 함수 ABI:", donateFunction);
    if (donateFunction) {
      console.log("donate 함수 입력:", donateFunction.inputs);
    } else {
      console.error("❌ donate 함수를 ABI에서 찾을 수 없습니다!");
    }
  }, []);

  // 지갑 연결 상태 확인 함수
  const checkWalletConnection = async (silent = false) => {
    if (!silent) console.log("지갑 연결 확인 시작...");

    if (!window.ethereum) {
      if (!silent) toast.error("MetaMask가 설치되지 않았습니다!");
      return;
    }

    try {
      // Ethers v6 우선, 실패 시 v5
      let web3Provider;
      try {
        web3Provider = new ethers.BrowserProvider(window.ethereum);
        if (!silent) console.log("Ethers v6 provider 생성 성공");
      } catch {
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        if (!silent) console.log("Ethers v5 provider 생성 성공");
      }

      setProvider(web3Provider);

      const accounts = await web3Provider.listAccounts();
      if (!silent) console.log("계정 목록:", accounts);

      if (accounts.length > 0) {
        const signer = await web3Provider.getSigner();
        const address = await signer.getAddress();
        if (!silent) console.log("연결된 계정:", address);
        setAccount(address);

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        try {
          const fee = await contractInstance.platformFee();
          const feeNumber =
            typeof fee?.toNumber === "function" ? fee.toNumber() : Number(fee);
          setPlatformFee(feeNumber);
        } catch (feeError) {
          console.error("수수료 정보 조회 실패:", feeError);
          setPlatformFee(250); // 기본 2.5%
        }

        setContract(contractInstance);

        if (!silent) toast.success("지갑이 성공적으로 연결되었습니다!");

        try {
          const blockNumber = await web3Provider.getBlockNumber();
          console.log("현재 블록:", blockNumber);
        } catch (blockError) {
          console.error("블록 번호 조회 실패:", blockError);
        }

        try {
          const code =
            web3Provider.getCode
              ? await web3Provider.getCode(contractAddress)
              : await web3Provider.provider.getCode(contractAddress);
          console.log("컨트랙트 존재:", code !== "0x");
          if (code === "0x") {
            console.warn("⚠️ 컨트랙트가 배포되지 않았거나 주소가 잘못되었습니다!");
          }
        } catch (codeError) {
          console.error("컨트랙트 코드 조회 실패:", codeError);
        }

        return true;
      } else {
        if (!silent) {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            return await checkWalletConnection(silent);
          } catch (connectError) {
            console.error("계정 연결 요청 실패:", connectError);
            toast.error("MetaMask 연결을 거부했습니다.");
          }
        }
        return false;
      }
    } catch (error) {
      console.error("지갑 연결 확인 중 오류:", error);
      if (!silent) toast.error("지갑 연결 중 오류: " + error.message);
      return false;
    }
  };

  useEffect(() => {
    if (!campaign) {
      console.error("캠페인 정보가 없습니다.");
      navigate("/donate/campaign");
      return;
    }

    console.log("=== 캠페인 정보 분석 ===");
    console.log("캠페인 전체:", campaign);
    console.log("캠페인 카테고리:", campaign.category);
    console.log(
      "매핑된 카테고리 값:",
      getDonationCategoryValue(campaign.category)
    );
    console.log(
      "스마트컨트랙트 enum:",
      getEnumName(getDonationCategoryValue(campaign.category))
    );
    console.log("========================");

    checkWalletConnection(true); // silent
  }, [campaign, navigate]);

  // 메타마스크 계정 변경 감지
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log("계정 변경됨:", accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkWalletConnection(true);
        } else {
          setAccount("");
          setContract(null);
          toast.info("MetaMask 연결이 해제되었습니다.");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // ✅ 입력 검증: SCN 기준(최소 10 SCN) + ETH 양수 검증
  const validateInputs = () => {
    console.log("입력값 검증 중...");
    console.log("표시 금액(SCN):", displayAmountSCN, " / ETH:", donateAmount);
    console.log("캠페인 지갑 주소:", campaign?.walletAddress);

    const scn = Number(displayAmountSCN);
    const eth = Number(donateAmount);

    if (!displayAmountSCN || isNaN(scn) || scn <= 0) {
      setValidationError("유효한 기부 금액(SCN)을 입력해주세요.");
      return false;
    }

    if (scn < 10) {
      setValidationError("최소 기부 금액은 10 SCN입니다.");
      return false;
    }

    if (!donateAmount || isNaN(eth) || eth <= 0) {
      setValidationError("내부 변환값(ETH)이 올바르지 않습니다. 다시 입력해주세요.");
      return false;
    }

    if (!campaign?.walletAddress) {
      setValidationError("수혜자 주소가 설정되지 않았습니다.");
      return false;
    }

    // 주소 검증 (v6/v5 호환)
    let isValidAddress;
    try {
      isValidAddress = ethers.isAddress(campaign.walletAddress);
    } catch {
      isValidAddress = ethers.utils.isAddress(campaign.walletAddress);
    }
    if (!isValidAddress) {
      setValidationError("유효하지 않은 수혜자 주소입니다.");
      return false;
    }

    setValidationError("");
    return true;
  };

  // 🚀 강화된 기부 기록 저장 함수 (타임아웃 및 재시도 로직 포함)
  const recordDonation = async (transactionHash, retryCount = 0) => {
    const maxRetries = 3;
    const timeoutMs = 10000; // 10초 타임아웃

    console.log(
      `🔄 기부 기록 저장 시작 (시도 ${retryCount + 1}/${maxRetries + 1}):`,
      transactionHash
    );
    console.log(`📍 SERVER_URL: ${SERVER_URL}`);
    console.log(`💳 account: ${account}`);
    console.log(`🎯 campaign.id: ${campaign.id}`);
    console.log(`💰 donateAmount(ETH): ${donateAmount}`);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.");

      // 사용자 조회 (타임아웃)
      const userController = new AbortController();
      const userTimeout = setTimeout(() => userController.abort(), timeoutMs);

      let userData;
      try {
        const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: userController.signal,
        });
        clearTimeout(userTimeout);
        if (!userResponse.ok) {
          throw new Error(
            `사용자 정보 조회 실패 (${userResponse.status}): ${userResponse.statusText}`
          );
        }
        userData = await userResponse.json();
      } catch (e) {
        clearTimeout(userTimeout);
        throw e;
      }

      const donationData = {
        transactionHash,
        donorWalletAddress: account,
        campaignWalletAddress: campaign.walletAddress,
        amount: parseFloat(donateAmount), // ✅ 서버로 ETH 값 전달
        campaignId: parseInt(campaign.id),
        userId: parseInt(userData.id),
        message: `${campaign.name}에 ${donateAmount} ETH 기부`,
      };

      const donationController = new AbortController();
      const donationTimeout = setTimeout(() => donationController.abort(), timeoutMs);

      const response = await fetch(`${SERVER_URL}/api/donations/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(donationData),
        signal: donationController.signal,
      });

      clearTimeout(donationTimeout);
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`서버 응답 파싱 실패: ${response.statusText}`);
      }

      if (!response.ok) {
        if (response.status === 409) throw new Error("이미 기록된 트랜잭션입니다.");
        if (response.status === 400) {
          if (data.code === "DONATION4002") throw new Error("유효하지 않은 트랜잭션입니다.");
          if (data.code === "DONATION4001") throw new Error("트랜잭션 해시가 필요합니다.");
          throw new Error(data.message || "입력값이 올바르지 않습니다.");
        }
        if (response.status === 404) {
          if (data.message?.includes("학생")) throw new Error("사용자 정보를 찾을 수 없습니다.");
          if (data.message?.includes("캠페인")) throw new Error("캠페인 정보를 찾을 수 없습니다.");
          throw new Error("관련 정보를 찾을 수 없습니다.");
        }
        if (response.status >= 500) {
          throw new Error(`서버 오류 (${response.status}): ${data.message || response.statusText}`);
        }
        throw new Error(`API 오류 (${response.status}): ${data.message || response.statusText}`);
      }

      if (data && data.isSuccess === false) {
        throw new Error(data.message || "기부 기록 저장에 실패했습니다.");
      }

      console.log("✅ 기부 기록 저장 성공!");
      return true;
    } catch (error) {
      console.error(`❌ 기부 기록 저장 중 오류 (시도 ${retryCount + 1}):`, error);

      const isRetryableError =
        error.name === "AbortError" ||
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout") ||
        error.message.includes("서버 오류") ||
        error.message.includes("Failed to fetch");

      if (retryCount < 3 && isRetryableError) {
        const waitTime = (retryCount + 1) * 2000;
        setDonationStep(`API 호출 재시도 중... (${retryCount + 1}/3)`);
        await new Promise((r) => setTimeout(r, waitTime));
        return await recordDonation(transactionHash, retryCount + 1);
      }

      throw error;
    }
  };

  const handleDonate = async () => {
    console.log("🚀 기부 처리 시작...");
    console.log("컨트랙트:", contract);
    console.log("계정:", account);

    if (!contract) {
      toast.error("스마트 컨트랙트에 연결되지 않았습니다. 지갑을 다시 연결해주세요.");
      return;
    }
    if (!account) {
      toast.error("지갑이 연결되지 않았습니다.");
      return;
    }
    if (!validateInputs()) return;

    setLoading(true);
    setDonationStep("트랜잭션 준비 중...");

    try {
      console.log("트랜잭션 실행 중...");

      // ✅ 바로 ETH를 파싱 (이미 donateAmount는 ETH)
      let parsedAmount;
      try {
        parsedAmount = ethers.parseEther(donateAmount);
      } catch {
        parsedAmount = ethers.utils.parseEther(donateAmount);
      }
      console.log("파싱된 금액(wei):", parsedAmount.toString());

      const categoryValue = getDonationCategoryValue(campaign.category);
      if (categoryValue < 0 || categoryValue > 5) {
        throw new Error(`잘못된 카테고리 값: ${categoryValue}. 0-5 범위여야 합니다.`);
      }

      // 잔액 확인
      setDonationStep("잔액 확인 중...");
      try {
        const balance = await provider.getBalance(account);
        let balanceFormatted;
        try {
          balanceFormatted = ethers.formatEther(balance);
        } catch {
          balanceFormatted = ethers.utils.formatEther(balance);
        }
        console.log("계정 잔액:", balanceFormatted, "ETH");

        // v6 BigInt 비교 vs v5 BigNumber 비교 모두 대응
        const insufficient =
          (typeof balance === "bigint" && balance < parsedAmount) ||
          (balance?._isBigNumber && balance.lt(parsedAmount));
        if (insufficient) throw new Error("잔액이 부족합니다.");
      } catch (balanceError) {
        console.warn("잔액 확인 실패:", balanceError);
      }

      // 가스 추정 및 전송
      setDonationStep("가스비 추정 중...");
      try {
        const estimatedGas = await contract.estimateGas.donate(
          campaign.walletAddress,
          categoryValue,
          { value: parsedAmount }
        );

        let gasLimit;
        if (estimatedGas?.mul) {
          gasLimit = estimatedGas.mul(120).div(100);
        } else {
          const gasNumber =
            typeof estimatedGas?.toNumber === "function"
              ? estimatedGas.toNumber()
              : Number(estimatedGas);
          gasLimit = Math.floor(gasNumber * 1.2);
        }

        setDonationStep("트랜잭션 실행 중...");
        const tx = await contract.donate(campaign.walletAddress, categoryValue, {
          value: parsedAmount,
          gasLimit,
        });

        toast.info(`기부 트랜잭션이 진행 중입니다... (${tx.hash.substring(0, 10)}...)`);
        setDonationStep("블록체인 확인 대기 중...");
        const receipt = await tx.wait();

        toast.success("블록체인 기부가 완료되었습니다!");

        // 기록 저장
        setDonationStep("기부 기록 저장 중...");
        try {
          await recordDonation(receipt.transactionHash);
          toast.success("✅ 기부 기록이 성공적으로 저장되었습니다!");
          setDonationStep("완료!");
          navigate(`/donate/campaign/${campaign.id}`, {
            state: {
              showDonationModal: true,
              donationAmountETH: donateAmount, // ETH
              donationAmountSCN: displayAmountSCN, // SCN
              campaignName: campaign.name,
              campaignCategory: campaign.category,
              transactionHash: receipt.transactionHash,
            },
          });
        } catch (recordError) {
          toast.error(
            `⚠️ 블록체인 기부는 완료되었으나 기록 저장에 실패했습니다.\n${recordError.message}\n\n트랜잭션 해시: ${receipt.transactionHash}`,
            { autoClose: false, closeOnClick: true }
          );
          navigate(`/donate/campaign/${campaign.id}`, {
            state: {
              showDonationModal: true,
              donationAmountETH: donateAmount,
              donationAmountSCN: displayAmountSCN,
              campaignName: campaign.name,
              campaignCategory: campaign.category,
              transactionHash: receipt.transactionHash,
              recordSaveError: recordError.message,
            },
          });
        }
      } catch (gasError) {
        console.error("가스 추정 실패:", gasError);
        setDonationStep("트랜잭션 실행 중 (fallback)...");
        const tx = await contract.donate(campaign.walletAddress, categoryValue, {
          value: parsedAmount,
        });
        toast.info(`기부 트랜잭션이 진행 중입니다... (${tx.hash.substring(0, 10)}...)`);
        const receipt = await tx.wait();
        toast.success("블록체인 기부가 완료되었습니다!");

        setDonationStep("기부 기록 저장 중...");
        try {
          await recordDonation(receipt.transactionHash);
          toast.success("기부 기록이 성공적으로 저장되었습니다!");
        } catch (recordError) {
          toast.warning("⚠️ 블록체인 기부는 완료되었으나 기록 저장에 실패했습니다: " + recordError.message);
        }

        setDonationStep("완료!");
        navigate(`/donate/campaign/${campaign.id}`, {
          state: {
            showDonationModal: true,
            donationAmountETH: donateAmount,
            donationAmountSCN: displayAmountSCN,
            campaignName: campaign.name,
            campaignCategory: campaign.category,
            transactionHash: receipt.transactionHash,
          },
        });
      }
    } catch (error) {
      console.error("기부 오류:", error);
      let errorMessage = "기부 처리 중 오류가 발생했습니다.";
      if (error.code === 4001) errorMessage = "사용자가 트랜잭션을 취소했습니다.";
      else if (error.code === "INSUFFICIENT_FUNDS") errorMessage = "잔액이 부족합니다.";
      else if (error.message?.includes("user rejected")) errorMessage = "사용자가 트랜잭션을 거부했습니다.";
      else if (error.message?.includes("execution reverted"))
        errorMessage = "스마트 컨트랙트 실행 실패. 카테고리나 수혜자 주소를 확인해주세요.";
      else if (error.message) errorMessage += " " + error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDonationStep("");
    }
  };

  const formatEther = (amount) => {
    try {
      if (ethers.utils?.formatEther) return ethers.utils.formatEther(amount);
      return ethers.formatEther(amount);
    } catch (error) {
      console.error("포맷팅 오류:", error);
      return "0";
    }
  };

  const parseEther = (amount) => {
    try {
      if (ethers.utils?.parseEther) return ethers.utils.parseEther(amount);
      return ethers.parseEther(amount);
    } catch (error) {
      console.error("파싱 오류:", error);
      return ethers.BigNumber ? ethers.BigNumber.from(0) : 0n;
    }
  };

  if (!campaign) {
    console.error("캠페인 정보 없음");
    return (
      <div className="donate-section">
        <h2>오류</h2>
        <p>캠페인 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate("/donate/campaign")}>
          캠페인 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // ✅ 입력 변경 핸들러: SCN → ETH 변환하여 저장
  const handleAmountChange = (e) => {
    const input = e.target.value; // 문자열
    setDisplayAmountSCN(input);

    const n = Number(input);
    if (!input || isNaN(n) || n <= 0) {
      setDonateAmount(""); // ETH 비움
      return;
    }
    // SCN 1 = ETH 0.0001 (SCN/10000 = ETH)
    const eth = (n / 10000).toString();
    setDonateAmount(eth);
  };

  return (
    <div className="donate-section">
      <div className="donate-campaign-info">
        <h3>캠페인 '{campaign.name}'에 기부하기</h3>
      </div>

      <div className="input-group">
        <label htmlFor="donateAmount">기부 금액 (SCN)</label>
        <input
          id="donateAmount"
          type="number"
          min="10"
          step="1"
          value={displayAmountSCN}
          onChange={handleAmountChange}
          disabled={loading}
          placeholder="최소 10 SCN"
        />
      </div>

      <div className="beneficiary-info">
        <p className="beneficiary-label">수혜자 지갑 주소</p>
        <p className="beneficiary-address">{campaign.walletAddress}</p>
      </div>

      {platformFee > 0 && displayAmountSCN && Number(displayAmountSCN) > 0 && (
        <div className="fee-info">
          <p>
            플랫폼 수수료: {(platformFee / 100).toFixed(2)}% (
            {((Number(displayAmountSCN || "0") * platformFee) / 10000).toFixed(3)} SCN)
          </p>
          <p>
            수혜자 수령액:{" "}
            {(
              (Number(displayAmountSCN || "0") * (10000 - platformFee)) /
              10000
            ).toFixed(3)} SCN
          </p>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            (내부 전송 값: {donateAmount || "0"} ETH)
          </p>
        </div>
      )}

      {validationError && <p className="error-message">{validationError}</p>}

      {/* 🚀 기부 진행 상태 표시 */}
      {loading && donationStep && (
        <div className="donation-progress">
          <p className="progress-text">📊 진행 상태: {donationStep}</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      )}

      <button
        onClick={handleDonate}
        disabled={loading || !account || !contract}
        className={`donate-button ${loading ? "loading" : ""}`}
      >
        {loading
          ? `처리 중... ${donationStep ? `(${donationStep})` : ""}`
          : !account
          ? "지갑을 연결해주세요"
          : "기부하기"}
      </button>

      <div className="account-info">
        <p>
          연결된 지갑:{" "}
          {account ? (
            `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          ) : (
            <span className="not-connected">연결되지 않음</span>
          )}
        </p>
        {!account && (
          <button
            onClick={() => checkWalletConnection(false)}
            className="connect-wallet-button"
            disabled={loading}
          >
            지갑 연결하기
          </button>
        )}
      </div>

      {/* 🎯 개선된 디버그 정보 (개발 환경에서만) */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "5px",
          }}
        >
          <h4>🔍 디버그 정보</h4>
          <p>계정: {account || "없음"}</p>
          <p>컨트랙트: {contract ? "연결됨" : "연결 안됨"}</p>
          <p>플랫폼 수수료: {platformFee}</p>
          <p>표시 금액(SCN): {displayAmountSCN}</p>
          <p>내부 전송 금액(ETH): {donateAmount}</p>
          <p>캠페인 ID: {campaign?.id}</p>
          <p>캠페인 지갑: {campaign?.walletAddress}</p>
          <p>
            <strong>캠페인 카테고리: "{campaign?.category}"</strong>
          </p>
          <p>
            <strong>
              스마트컨트랙트 카테고리 값: {getDonationCategoryValue(campaign?.category)}
            </strong>
          </p>
          <p>
            <strong>
              enum 이름: {getEnumName(getDonationCategoryValue(campaign?.category))}
            </strong>
          </p>
          {donationStep && (
            <p>
              <strong>현재 진행 상태: {donationStep}</strong>
            </p>
          )}
          <hr />
          <h5>🔧 API 테스트</h5>
          <p>SERVER_URL: {SERVER_URL}</p>
          <p>토큰 존재: {localStorage.getItem("token") ? "있음" : "없음"}</p>
          <button
            onClick={async () => {
              console.log("=== API 연결 테스트 ===");
              try {
                const response = await fetch(`${SERVER_URL}/auth/me`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                });
                console.log("응답 상태:", response.status);
                const data = await response.json();
                console.log("응답 데이터:", data);
              } catch (error) {
                console.error("API 테스트 실패:", error);
              }
            }}
            style={{
              padding: "5px 10px",
              margin: "5px 0",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            API 연결 테스트
          </button>
        </div>
      )}
    </div>
  );
}

export default MetamaskDonate;

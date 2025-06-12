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
  const [donateAmount, setDonateAmount] = useState("0.01");
  const [platformFee, setPlatformFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [provider, setProvider] = useState(null);
  const [donationStep, setDonationStep] = useState(""); // 기부 진행 단계 표시
  const contractAddress = "0xCa32413067e66A1604163bF1740b9F5B32699023";

  // 🎯 개선된 한글 카테고리 매핑 함수
  const getDonationCategoryValue = (categoryString) => {
    if (!categoryString) {
      console.warn("⚠️ 카테고리가 없음 → 기본값 5 (SOCIETY) 사용");
      return 5;
    }

    console.log("🔍 카테고리 매핑:", categoryString);

    // ✅ React categories와 스마트 컨트랙트 enum 정확한 1:1 매핑
    const koreanCategoryMap = {
      // React에서 사용하는 한글 카테고리 (정확한 매핑)
      아동청소년: 0, // CHILDREN
      노인: 1, // ELDERLY
      환경: 2, // ENVIRONMENT
      동물: 3, // ANIMAL
      장애인: 4, // MEDICAL
      사회: 5, // SOCIETY
      전체: 5, // '전체'는 스마트컨트랙트에 없으므로 SOCIETY로

      // 추가 호환성을 위한 매핑
      노인복지: 1, // ELDERLY
      동물보호: 3, // ANIMAL
      의료: 4, // MEDICAL

      // 영어 enum 이름도 지원
      CHILDREN: 0,
      ELDERLY: 1,
      ENVIRONMENT: 2,
      ANIMAL: 3,
      MEDICAL: 4,
      SOCIETY: 5,
    };

    const trimmedCategory = categoryString.toString().trim();

    if (koreanCategoryMap.hasOwnProperty(trimmedCategory)) {
      const value = koreanCategoryMap[trimmedCategory];
      const enumName = getEnumName(value);
      console.log(
        `✅ 매핑 성공: "${trimmedCategory}" → ${value} (${enumName})`
      );
      return value;
    }

    // 매핑 실패시 기본값
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

  // 🧪 매핑 테스트 함수 (개발용)
  const testKoreanCategoryMapping = () => {
    const reactCategories = [
      "전체",
      "아동청소년",
      "노인",
      "환경",
      "동물",
      "장애인",
      "사회",
    ];

    console.log("=== 한글 카테고리 매핑 테스트 ===");
    reactCategories.forEach((category) => {
      const mappedValue = getDonationCategoryValue(category);
      console.log(
        `"${category}" → ${mappedValue} (${getEnumName(mappedValue)})`
      );
    });
    console.log("===================================");
  };

  // 페이지 진입 시 스크롤 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);

    // 🧪 개발환경에서 카테고리 매핑 테스트
    if (process.env.NODE_ENV === "development") {
      testKoreanCategoryMapping();
    }

    // ABI 체크
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
      // Ethers v6 문법 사용
      let web3Provider;
      try {
        // v6 문법 시도
        web3Provider = new ethers.BrowserProvider(window.ethereum);
        if (!silent) console.log("Ethers v6 provider 생성 성공");
      } catch (error) {
        // v5 문법으로 fallback
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

        // 컨트랙트 인스턴스 생성
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // 플랫폼 수수료 조회
        try {
          const fee = await contractInstance.platformFee();
          if (!silent) console.log("플랫폼 수수료:", fee);

          // v6에서는 .toNumber() 대신 Number() 사용
          const feeNumber =
            typeof fee.toNumber === "function" ? fee.toNumber() : Number(fee);
          setPlatformFee(feeNumber);
        } catch (feeError) {
          console.error("수수료 정보 조회 실패:", feeError);
          setPlatformFee(250); // 기본값 2.5%
        }

        setContract(contractInstance);

        // 🔥 인증 페이지에서 온 경우 조용히 연결, 아니면 성공 메시지
        if (!silent) {
          toast.success("지갑이 성공적으로 연결되었습니다!");
        } else {
          console.log("✅ 인증된 지갑 자동 연결 완료:", address);
        }

        return true; // 연결 성공
      } else {
        if (!silent) {
          console.log("연결된 계정이 없습니다.");
          // 수동 연결 시에만 계정 연결 요청
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            // 재귀 호출로 다시 연결 확인
            return await checkWalletConnection(silent);
          } catch (connectError) {
            console.error("계정 연결 요청 실패:", connectError);
            toast.error("MetaMask 연결을 거부했습니다.");
          }
        }
        return false; // 연결 실패
      }
    } catch (error) {
      console.error("지갑 연결 확인 중 오류:", error);
      if (!silent) {
        toast.error("지갑 연결 중 오류가 발생했습니다: " + error.message);
      }
      return false;
    }
  };

  useEffect(() => {
    if (!campaign) {
      console.error("캠페인 정보가 없습니다.");
      navigate("/donate/campaign");
      return;
    }

    // 🔍 캠페인 정보 상세 로그
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

    // 🔥 인증 페이지에서 온 경우 조용히 연결 (토스트 메시지 없이)
    checkWalletConnection(true); // silent = true
  }, [campaign, navigate]);

  // 메타마스크 계정 변경 감지
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        console.log("계정 변경됨:", accounts);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // 계정이 변경되면 다시 연결 확인 (조용히)
          checkWalletConnection(true);
        } else {
          setAccount("");
          setContract(null);
          toast.info("MetaMask 연결이 해제되었습니다.");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
        }
      };
    }
  }, []);

  const validateInputs = () => {
    console.log("입력값 검증 중...");
    console.log("기부 금액:", donateAmount);
    console.log("캠페인 지갑 주소:", campaign?.walletAddress);

    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      setValidationError("유효한 기부 금액을 입력해주세요.");
      return false;
    }

    if (parseFloat(donateAmount) < 0.001) {
      setValidationError("최소 기부 금액은 0.001 ETH입니다.");
      return false;
    }

    if (!campaign?.walletAddress) {
      setValidationError("수혜자 주소가 설정되지 않았습니다.");
      return false;
    }

    // 🔧 ethers 버전 호환 주소 검증
    let isValidAddress;
    try {
      // v6 방식 시도
      isValidAddress = ethers.isAddress(campaign.walletAddress);
    } catch (error) {
      // v5 방식으로 fallback
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
    console.log(`💰 donateAmount: ${donateAmount}`);

    try {
      const token = localStorage.getItem("token");
      console.log(`🔐 토큰 존재 여부: ${token ? "있음" : "없음"}`);

      if (!token) {
        throw new Error("인증 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      }

      // 🔍 사용자 정보 조회 (타임아웃 적용)
      console.log("👤 사용자 정보 조회 중...");
      const userController = new AbortController();
      const userTimeout = setTimeout(() => userController.abort(), timeoutMs);

      try {
        const userResponse = await fetch(`${SERVER_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: userController.signal,
        });

        clearTimeout(userTimeout);

        if (!userResponse.ok) {
          console.error(
            `❌ 사용자 정보 조회 실패: ${userResponse.status} ${userResponse.statusText}`
          );
          throw new Error(
            `사용자 정보 조회 실패 (${userResponse.status}): ${userResponse.statusText}`
          );
        }

        const userData = await userResponse.json();
        console.log("✅ 사용자 정보 조회 성공:", userData);

        // 🎯 기부 데이터 준비
        const donationData = {
          transactionHash: transactionHash,
          donorWalletAddress: account,
          campaignWalletAddress: campaign.walletAddress,
          amount: parseFloat(donateAmount),
          campaignId: parseInt(campaign.id),
          userId: parseInt(userData.id),
          message: `${campaign.name}에 ${donateAmount} ETH 기부`,
        };

        console.log(
          "📝 기부 기록 데이터:",
          JSON.stringify(donationData, null, 2)
        );

        // 🚀 기부 기록 API 호출 (타임아웃 적용)
        console.log("💾 기부 기록 저장 API 호출 중...");
        const donationController = new AbortController();
        const donationTimeout = setTimeout(
          () => donationController.abort(),
          timeoutMs
        );

        const response = await fetch(`${SERVER_URL}/api/donations/record`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(donationData),
          signal: donationController.signal,
        });

        clearTimeout(donationTimeout);

        console.log(
          `📊 API 응답 상태: ${response.status} ${response.statusText}`
        );

        let data;
        try {
          data = await response.json();
          console.log("📄 API 응답 데이터:", JSON.stringify(data, null, 2));
        } catch (jsonError) {
          console.error("❌ JSON 파싱 실패:", jsonError);
          throw new Error(`서버 응답 파싱 실패: ${response.statusText}`);
        }

        if (!response.ok) {
          console.error(`❌ API 호출 실패: ${response.status}`, data);

          if (response.status === 409) {
            throw new Error("이미 기록된 트랜잭션입니다.");
          } else if (response.status === 400) {
            if (data.code === "DONATION4002") {
              throw new Error("유효하지 않은 트랜잭션입니다.");
            } else if (data.code === "DONATION4001") {
              throw new Error("트랜잭션 해시가 필요합니다.");
            } else {
              throw new Error(data.message || "입력값이 올바르지 않습니다.");
            }
          } else if (response.status === 404) {
            if (data.message?.includes("학생")) {
              throw new Error("사용자 정보를 찾을 수 없습니다.");
            } else if (data.message?.includes("캠페인")) {
              throw new Error("캠페인 정보를 찾을 수 없습니다.");
            } else {
              throw new Error("관련 정보를 찾을 수 없습니다.");
            }
          } else if (response.status >= 500) {
            throw new Error(
              `서버 오류 (${response.status}): ${
                data.message || response.statusText
              }`
            );
          } else {
            throw new Error(
              `API 오류 (${response.status}): ${
                data.message || response.statusText
              }`
            );
          }
        }

        // 응답 데이터 검증
        if (data && data.isSuccess === false) {
          throw new Error(data.message || "기부 기록 저장에 실패했습니다.");
        }

        console.log("✅ 기부 기록 저장 성공!");
        return true;
      } catch (fetchError) {
        clearTimeout(userTimeout);
        throw fetchError;
      }
    } catch (error) {
      console.error(
        `❌ 기부 기록 저장 중 오류 (시도 ${retryCount + 1}):`,
        error
      );

      // 🔄 재시도 조건 확인
      const isRetryableError =
        error.name === "AbortError" || // 타임아웃
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("timeout") ||
        error.message.includes("서버 오류") ||
        error.message.includes("Failed to fetch");

      if (retryCount < maxRetries && isRetryableError) {
        const waitTime = (retryCount + 1) * 2000; // 2초, 4초, 6초 대기
        console.log(
          `⏳ ${waitTime / 1000}초 후 재시도... (${
            retryCount + 1
          }/${maxRetries})`
        );
        setDonationStep(
          `API 호출 재시도 중... (${retryCount + 1}/${maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return await recordDonation(transactionHash, retryCount + 1);
      }

      // 재시도 불가능하거나 최대 재시도 횟수 초과
      throw error;
    }
  };

  const handleDonate = async () => {
    console.log("🚀 기부 처리 시작...");
    console.log("컨트랙트:", contract);
    console.log("계정:", account);

    if (!contract) {
      toast.error(
        "스마트 컨트랙트에 연결되지 않았습니다. 지갑을 다시 연결해주세요."
      );
      return;
    }

    if (!account) {
      toast.error("지갑이 연결되지 않았습니다.");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setDonationStep("트랜잭션 준비 중...");

    try {
      console.log("트랜잭션 실행 중...");

      // Ethers 버전에 따른 분기 처리
      let parsedAmount;
      try {
        parsedAmount = ethers.parseEther(donateAmount);
      } catch (error) {
        parsedAmount = ethers.utils.parseEther(donateAmount);
      }

      console.log("파싱된 금액:", parsedAmount.toString());

      // 🎯 한글 카테고리 → 스마트 컨트랙트 enum 값 변환
      const categoryValue = getDonationCategoryValue(campaign.category);

      console.log("=== 기부 카테고리 정보 ===");
      console.log("캠페인 카테고리:", campaign.category);
      console.log("스마트컨트랙트 값:", categoryValue);
      console.log("enum 이름:", getEnumName(categoryValue));
      console.log("========================");

      // 🚨 카테고리 값 유효성 검증
      if (categoryValue < 0 || categoryValue > 5) {
        throw new Error(
          `잘못된 카테고리 값: ${categoryValue}. 0-5 범위여야 합니다.`
        );
      }

      // 잔액 확인
      setDonationStep("잔액 확인 중...");
      try {
        const balance = await provider.getBalance(account);

        // ethers 버전 호환 formatEther
        let balanceFormatted;
        try {
          balanceFormatted = ethers.formatEther(balance);
        } catch (error) {
          balanceFormatted = ethers.utils.formatEther(balance);
        }

        console.log("계정 잔액:", balanceFormatted, "ETH");

        if (balance.lt(parsedAmount)) {
          throw new Error("잔액이 부족합니다.");
        }
      } catch (balanceError) {
        console.warn("잔액 확인 실패:", balanceError);
      }

      // 🔥 트랜잭션 실행 - 가스 추정
      setDonationStep("가스비 추정 중...");
      try {
        console.log("가스 추정 중...");
        const estimatedGas = await contract.estimateGas.donate(
          campaign.walletAddress,
          categoryValue, // ✅ 한글 → enum 값 변환된 결과
          { value: parsedAmount }
        );
        console.log("추정된 가스:", estimatedGas.toString());

        // 안전한 가스 한도 계산
        let gasLimit;
        try {
          gasLimit = estimatedGas.mul(120).div(100);
        } catch (error) {
          const gasNumber =
            typeof estimatedGas.toNumber === "function"
              ? estimatedGas.toNumber()
              : Number(estimatedGas);
          gasLimit = Math.floor(gasNumber * 1.2);
        }

        console.log("설정된 가스 한도:", gasLimit.toString());

        // 🚀 실제 트랜잭션 실행
        setDonationStep("트랜잭션 실행 중...");
        const tx = await contract.donate(
          campaign.walletAddress,
          categoryValue, // ✅ 한글 → enum 값 변환된 결과
          {
            value: parsedAmount,
            gasLimit: gasLimit,
          }
        );

        console.log("트랜잭션 해시:", tx.hash);
        setDonationStep("블록체인 확인 대기 중...");
        toast.info(
          `기부 트랜잭션이 진행 중입니다... (${tx.hash.substring(0, 10)}...)`
        );

        console.log("트랜잭션 대기 중...");
        const receipt = await tx.wait();
        console.log("트랜잭션 완료:", receipt);

        toast.success("블록체인 기부가 완료되었습니다!");

        // 🚀 즉시 기부 기록 저장 API 호출
        setDonationStep("기부 기록 저장 중...");
        try {
          await recordDonation(receipt.transactionHash);
          toast.success("✅ 기부 기록이 성공적으로 저장되었습니다!");

          // 성공 페이지로 이동
          setDonationStep("완료!");
          navigate(`/donate/campaign/${campaign.id}`, {
            state: {
              showDonationModal: true,
              donationAmount: donateAmount,
              campaignName: campaign.name,
              campaignCategory: campaign.category,
              transactionHash: receipt.transactionHash,
            },
          });
        } catch (recordError) {
          console.error("❌ 기부 기록 저장 실패:", recordError);

          // 더 구체적인 에러 정보 표시
          let errorDetails = "";
          if (recordError.message.includes("토큰")) {
            errorDetails = "\n다시 로그인 후 시도해주세요.";
          } else if (
            recordError.message.includes("네트워크") ||
            recordError.message.includes("timeout")
          ) {
            errorDetails = "\n네트워크 연결을 확인해주세요.";
          } else if (recordError.message.includes("서버")) {
            errorDetails = "\n잠시 후 다시 시도해주세요.";
          }

          toast.error(
            `⚠️ 블록체인 기부는 완료되었으나 기록 저장에 실패했습니다.\n${recordError.message}${errorDetails}\n\n트랜잭션 해시: ${receipt.transactionHash}`,
            {
              autoClose: false, // 자동으로 닫히지 않게
              closeOnClick: true,
            }
          );

          // 기록 저장 실패해도 성공 페이지로 이동 (트랜잭션 해시와 함께)
          navigate(`/donate/campaign/${campaign.id}`, {
            state: {
              showDonationModal: true,
              donationAmount: donateAmount,
              campaignName: campaign.name,
              campaignCategory: campaign.category,
              transactionHash: receipt.transactionHash,
              recordSaveError: recordError.message, // 에러 정보도 전달
            },
          });
        }
      } catch (gasError) {
        console.error("가스 추정 실패:", gasError);
        console.log("가스 추정 없이 트랜잭션 시도...");

        // 🔥 가스 추정 실패 시 fallback
        setDonationStep("트랜잭션 실행 중 (fallback)...");
        const tx = await contract.donate(
          campaign.walletAddress,
          categoryValue, // ✅ 한글 → enum 값 변환된 결과
          {
            value: parsedAmount,
          }
        );

        console.log("트랜잭션 해시:", tx.hash);
        setDonationStep("블록체인 확인 대기 중...");
        toast.info(
          `기부 트랜잭션이 진행 중입니다... (${tx.hash.substring(0, 10)}...)`
        );

        const receipt = await tx.wait();
        console.log("트랜잭션 완료:", receipt);
        toast.success("블록체인 기부가 완료되었습니다!");

        // 🚀 즉시 기부 기록 저장 API 호출
        setDonationStep("기부 기록 저장 중...");
        try {
          await recordDonation(receipt.transactionHash);
          toast.success("기부 기록이 성공적으로 저장되었습니다!");
        } catch (recordError) {
          console.error("기부 기록 저장 실패:", recordError);
          toast.warning(
            "⚠️ 블록체인 기부는 완료되었으나 기록 저장에 실패했습니다: " +
              recordError.message
          );
        }

        setDonationStep("완료!");
        navigate(`/donate/campaign/${campaign.id}`, {
          state: {
            showDonationModal: true,
            donationAmount: donateAmount,
            campaignName: campaign.name,
            campaignCategory: campaign.category,
            transactionHash: receipt.transactionHash,
          },
        });
      }
    } catch (error) {
      console.error("기부 오류:", error);

      let errorMessage = "기부 처리 중 오류가 발생했습니다.";

      if (error.code === 4001) {
        errorMessage = "사용자가 트랜잭션을 취소했습니다.";
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "잔액이 부족합니다.";
      } else if (error.message?.includes("user rejected")) {
        errorMessage = "사용자가 트랜잭션을 거부했습니다.";
      } else if (error.message?.includes("execution reverted")) {
        errorMessage =
          "스마트 컨트랙트 실행 실패. 카테고리나 수혜자 주소를 확인해주세요.";
      } else if (error.message) {
        errorMessage += " " + error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDonationStep("");
    }
  };

  const formatEther = (amount) => {
    try {
      if (ethers.utils && ethers.utils.formatEther) {
        return ethers.utils.formatEther(amount);
      } else {
        return ethers.formatEther(amount);
      }
    } catch (error) {
      console.error("포맷팅 오류:", error);
      return "0";
    }
  };

  // parseEther 함수
  const parseEther = (amount) => {
    try {
      if (ethers.utils && ethers.utils.parseEther) {
        return ethers.utils.parseEther(amount);
      } else {
        return ethers.parseEther(amount);
      }
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

  return (
    <div className="donate-section">
      <div className="donate-campaign-info">
        <h3>캠페인 '{campaign.name}'에 기부하기</h3>
      </div>

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
          placeholder="최소 0.001 ETH"
        />
      </div>

      <div className="beneficiary-info">
        <p className="beneficiary-label">수혜자 지갑 주소</p>
        <p className="beneficiary-address">{campaign.walletAddress}</p>
      </div>

      {platformFee > 0 && donateAmount && parseFloat(donateAmount) > 0 && (
        <div className="fee-info">
          <p>
            플랫폼 수수료: {(platformFee / 100).toFixed(2)}% (
            {formatEther(
              parseEther(donateAmount || "0")
                ?.mul?.(platformFee)
                ?.div?.(10000) || "0"
            )}{" "}
            ETH)
          </p>
          <p>
            수혜자 수령액:{" "}
            {formatEther(
              parseEther(donateAmount || "0")
                ?.mul?.(10000 - platformFee)
                ?.div?.(10000) || "0"
            )}{" "}
            ETH
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
            `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          ) : (
            <span className="not-connected">연결되지 않음</span>
          )}
        </p>
        {!account && (
          <button
            onClick={() => checkWalletConnection(false)} // silent = false, 토스트 메시지 표시
            className="connect-wallet-button"
            disabled={loading}
          >
            지갑 연결하기
          </button>
        )}
      </div>
{/* 
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
          <p>기부 금액: {donateAmount}</p>
          <p>캠페인 ID: {campaign?.id}</p>
          <p>캠페인 지갑: {campaign?.walletAddress}</p>
          <p>
            <strong>캠페인 카테고리: "{campaign?.category}"</strong>
          </p>
          <p>
            <strong>
              스마트컨트랙트 카테고리 값:{" "}
              {getDonationCategoryValue(campaign?.category)}
            </strong>
          </p>
          <p>
            <strong>
              enum 이름:{" "}
              {getEnumName(getDonationCategoryValue(campaign?.category))}
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
      )} */}
    </div>
  );
}

export default MetamaskDonate;

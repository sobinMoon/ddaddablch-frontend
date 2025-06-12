import React, { useEffect, useState } from "react";

export default function CheckHomeCampaignAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHomeCampaign() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://10.101.48.80:8080/api/v1/campaigns/home", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeCampaign();
  }, []);

  return (
    <div>
      <h2>API 작동 확인: /api/v1/campaigns/home</h2>
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}
      {data && (
        <pre
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

import React from 'react'
import { useParams } from 'react-router-dom';

export default function Campaign() {
  const { id } = useParams();

  return (
    <div>
      <h2>캠페인 상세 페이지</h2>
      <p>캠페인 ID: {id}</p>
    </div>
  );
}

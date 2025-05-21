import React from 'react'
import { useOutletContext } from 'react-router-dom';


export default function Campaignintro() {
  const { campaign } = useOutletContext();
  const text = campaign.description;
  return (
    <div>
      <div />
      <div>
        <p style={{
          padding: '0px',
          borderRadius: '10px',
          whiteSpace: 'pre-line', 
        }}>
       {text}
        </p>
      </div>

      <div />

    </div>



  )
}

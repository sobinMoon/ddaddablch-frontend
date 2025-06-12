import React from 'react'
import { useOutletContext } from 'react-router-dom';


export default function Campaignintro() {
  const { campaign } = useOutletContext();
  const text = campaign.description;
  console.log(text);

  return (
    <div>
      <div />
      <div>
        <p style={{
          padding: '0px',
          borderRadius: '10px',
          whiteSpace: 'pre-line',
          fontSize: '1.05rem',
        }}>
          {text.replace(/\\n|¶/g, '\n')}
        </p>
      </div>

      <div />

    </div>



  )
}

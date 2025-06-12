import React from 'react'
import { useOutletContext } from 'react-router-dom'
import Plandetailcard from '../components/Plandetailcard'

export default function Campaignplan() {
  const { campaign } = useOutletContext();
  
  return (
    <Plandetailcard campaignPlans={campaign.campaignPlans} goal={campaign.goal}/>
  )
}

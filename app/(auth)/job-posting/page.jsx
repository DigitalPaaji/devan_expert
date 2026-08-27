"use client"
import CreateJob from '@/components/CreateJob'
import GetJobs from '@/components/GetJobs'
import React, { useState } from 'react'

const page = () => {
const [showCreate,setShowCreate]=useState(false)


  return (
    <div>

{showCreate &&  <CreateJob   setShowCreate={setShowCreate}/> }
{!showCreate &&  <GetJobs   setShowCreate={setShowCreate}/> }





    </div>
  )
}

export default page
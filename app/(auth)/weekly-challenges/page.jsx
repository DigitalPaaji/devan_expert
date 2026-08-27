"use client"
import CreateWeeklyQuestion from '@/components/CreateWeeklyQuestion'
import GetNews from '@/components/GetNews'
import WeeklyQuestion from '@/components/WeeklyQuestion'
import React, { useState } from 'react'

const page = () => {
const [showCreate,setShowCreate]=useState(false)


  return (
    <div>

{showCreate &&  <CreateWeeklyQuestion   setShowCreate={setShowCreate}/> }
{!showCreate &&  <WeeklyQuestion   setShowCreate={setShowCreate}/> }





    </div>
  )
}

export default page
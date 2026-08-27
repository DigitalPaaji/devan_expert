"use client"
import EventCreate from '@/components/EventCreate'
import GetAllevent from '@/components/GetAllevent'
import React, { useState } from 'react'

const page = () => {
const [showCreate,setShowCreate]=useState(false)


  return (
    <div>

{showCreate &&  <EventCreate   setShowCreate={setShowCreate}/> }
{!showCreate &&  <GetAllevent   setShowCreate={setShowCreate}/> }

    </div>
  )
}

export default page
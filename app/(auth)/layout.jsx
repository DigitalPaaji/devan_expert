"use client"
import ExpertSidebar from '@/components/ExpertSidebar'
import Loading from '@/components/Loading'
import ThemeProvider from '@/components/ThemeProvider'
import { loginVerify } from '@/components/verifylogin'
import React, { useEffect, useState } from 'react'

const layout = ({children}) => {

const [loading,setLoading]=useState(true)


useEffect(()=>{loginVerify(setLoading)},[])

if(loading){
return <Loading  setLoading={setLoading} />
}

  return (<div>
  <ThemeProvider>
<div className='h-screen flex '>
<div>
    <ExpertSidebar />
</div>

  <div className='flex-1 h-full'>
{children}
</div>  
</div>
  </ThemeProvider>
  </div>
  )
}

export default layout
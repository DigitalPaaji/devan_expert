import ExpertSidebar from '@/components/ExpertSidebar'
import ThemeProvider from '@/components/ThemeProvider'
import React from 'react'

const layout = ({children}) => {
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
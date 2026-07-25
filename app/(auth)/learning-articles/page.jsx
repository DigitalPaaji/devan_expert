"use client"
import CrearteArticle from '@/components/CrearteArticle'
import React, { useState } from 'react'

const page = () => {

    const [createArticle,setCreateArticle]=useState(true)

  return (
    <div>


{createArticle &&

<CrearteArticle setCreateArticle={setCreateArticle} />
}


    </div>
  )
}

export default page
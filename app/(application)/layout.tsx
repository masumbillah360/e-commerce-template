import Navbar from '@/components/ui/navigation'
import React from 'react'

const AppLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}

export default AppLayout
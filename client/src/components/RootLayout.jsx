import React from 'react'
import Header from './common/Header';
import Footer from './common/Footer';
import {Outlet} from 'react-router-dom';
import {ClerkProvider} from '@clerk/clerk-react'
import {dark} from '@clerk/themes';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}



function RootLayout() {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
     publishableKey={PUBLISHABLE_KEY}>

     
    <div>
         <Header/>
            <div style={{minHeight:"90vh"}}>
              <Outlet />
            </div>
         
    </div>
    </ClerkProvider>
  )
}

export default RootLayout
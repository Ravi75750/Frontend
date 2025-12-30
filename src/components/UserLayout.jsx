// src/components/UserLayout.jsx
import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 
import { useUser } from './UserContext'; 

// Note: We need to receive the handlers (openLogin, openSignup, openProfile) 
// from the App component to make the Header buttons functional.

export default function UserLayout({ children, openLogin, openSignup, openProfile }) {
  const { user } = useUser();
    
  return (
    <>
      <Header
        // Pass the handlers based on user status
        onLoginClick={user ? openProfile : openLogin} 
        onSignUpClick={user ? openProfile : openSignup} 
      />
      
      {/* Render the wrapped content (e.g., Highlights) */}
      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function AdminProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to check which tab is active
  const isActive = (path) => {
    const currentPath = location.pathname;
    return currentPath.includes(path);
  };

  const handleTabClick = (route) => {
    navigate(route);
  };

  // CSS for glow effect
  const glowStyle = {
    transition: 'all 0.3s ease',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.7)'
  };

  return (
    <div className="bg-dark min-vh-100">
      {/* Admin Dashboard Heading */}
      <div className="container pt-4 pb-2">
        <h1 className="text-white mb-4">Admin Dashboard</h1>
      </div>

      {/* Navigation tabs with container */}
      <div className="container">
        <ul className="nav">
          <li className="nav-item me-4">
            <button 
              className="nav-link px-2 pb-3"
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0',
                color: isActive('articles') ? '#ffd700' : '#aaa',
                fontWeight: isActive('articles') ? 'bold' : 'normal',
                ...(isActive('articles') ? glowStyle : {})
              }}
              onClick={() => handleTabClick('articles')}
            >
              Articles
            </button>
          </li>
          <li className="nav-item me-4">
            <button 
              className="nav-link px-2 pb-3"
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0',
                color: isActive('users') ? '#ffd700' : '#aaa',
                fontWeight: isActive('users') ? 'bold' : 'normal',
                ...(isActive('users') ? glowStyle : {})
              }}
              onClick={() => handleTabClick('users')}
            >
              Users
            </button>
          </li>
          <li className="nav-item me-4">
            <button 
              className="nav-link px-2 pb-3"
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0',
                color: isActive('authors') ? '#ffd700' : '#aaa',
                fontWeight: isActive('authors') ? 'bold' : 'normal',
                ...(isActive('authors') ? glowStyle : {})
              }}
              onClick={() => handleTabClick('authors')}
            >
              Authors
            </button>
          </li>
        </ul>
        
        {/* Horizontal line below tabs within container */}
        <hr style={{ 
          borderTop: '1px solid #333333',
          margin: '0',
          opacity: '0.5'
        }} />
      </div>
      
      {/* Content area with container */}
      <div className="container py-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminProfile;
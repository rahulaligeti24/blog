import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Import React Icons
import { 
  FaNewspaper, 
  FaUsers, 
  FaPenNib, 
  FaUser, 
  FaSpinner, 
  FaShieldAlt, 
  FaFilter, 
  FaAngleDown 
} from 'react-icons/fa';

// Skeleton components for loading states
const UserSkeleton = () => (
  <div className="card mb-3 bg-dark text-white border-secondary">
    <div className="card-body">
      <div className="d-flex align-items-center">
        <div className="skeleton-circle me-3 d-flex align-items-center justify-content-center">
          <FaUser className="text-dark opacity-25" size={20} />
        </div>
        <div className="w-100">
          <div className="skeleton-line w-25 mb-2"></div>
          <div className="skeleton-line w-75"></div>
        </div>
      </div>
    </div>
  </div>
);

const AuthorSkeleton = () => (
  <div className="card mb-3  text-white border-secondary" style={{backgroundColor:'#141413'}}>
    <div className="card-body">
      <div className="d-flex">
        <div className="skeleton-circle me-3 d-flex align-items-center justify-content-center">
          <FaPenNib className="text-dark opacity-25" size={18} />
        </div>
        <div className="w-100">
          <div className="skeleton-line w-25 mb-2"></div>
          <div className="skeleton-line w-50 mb-2"></div>
          <div className="skeleton-line w-75"></div>
        </div>
      </div>
    </div>
  </div>
);

function AdminProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile filter when resizing to desktop
      if (window.innerWidth >= 768) {
        setShowMobileFilter(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Function to check which tab is active
  const isActive = (path) => {
    const currentPath = location.pathname;
    return currentPath.includes(path);
  };
  
  const handleTabClick = (route) => {
    setIsLoading(true); // Show loading state when changing tabs
    navigate(route);
    
    // Close mobile filter when a tab is clicked
    setShowMobileFilter(false);
    
    // Simulate loading time (remove this in production and use real data loading)
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Define mobile breakpoint
  const isMobile = windowWidth < 768;
  
  // Get current active filter name for mobile display
  const getCurrentFilter = () => {
    if (isActive('articles')) return 'Articles';
    if (isActive('users')) return 'Users';
    if (isActive('authors')) return 'Authors';
    return 'All Content';
  };
  
  // CSS for glow effect
  const glowStyle = {
    transition: 'all 0.3s ease',
    textShadow: '0 0 8px rgba(255, 215, 0, 0.7)'
  };

  // CSS for skeletons and responsive styles
  const styles = `
    .skeleton-line {
      height: 1rem;
      background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 0.25rem;
    }
    
    .skeleton-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    .nav-icon {
      margin-right: 6px;
      transition: all 0.3s ease;
    }
    
    /* Responsive styles */
    .mobile-filter-button {
      display: none;
    }
    
    @media (max-width: 767px) {
      .desktop-nav {
        display: none;
      }
      
      .mobile-filter-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background-color: #222;
        color: #ffd700;
        border: 1px solid #333;
        border-radius: 4px;
        padding: 10px 15px;
        font-weight: 500;
        margin-bottom: 15px;
      }
      
      .mobile-filter-menu {
        position: absolute;
        z-index: 999;
        background-color: #222;
        border: 1px solid #333;
        border-radius: 4px;
        width: calc(100% - 30px);
        margin-top: -15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .mobile-filter-item {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 12px 15px;
        border: none;
        background: transparent;
        color: #aaa;
        text-align: left;
        border-bottom: 1px solid #333;
      }
      
      .mobile-filter-item:last-child {
        border-bottom: none;
      }
      
      .mobile-filter-item.active {
        color: #ffd700;
        font-weight: bold;
        background-color: rgba(255, 215, 0, 0.1);
      }
      
      .admin-header {
        display: flex !important;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem !important;
      }
      
      .admin-icon {
        margin-right: 10px;
        color: #ffd700;
      }
      
      .skeleton-circle {
        width: 36px;
        height: 36px;
      }
    }
    
    @media (max-width: 576px) {
      .card-body {
        padding: 0.75rem;
      }
      
      .skeleton-circle {
        width: 32px;
        height: 32px;
      }
    }
  `;
  
  return (
    <div className=" min-vh-100" style={{backgroundColor:'#141413'}}>
      {/* Add skeleton styles */}
      <style>{styles}</style>
      
      {/* Admin Dashboard Heading */}
      <div className="container pt-4 pb-2">
        <h1 className="text-white mb-4 text-center mt-5 admin-header">
          <FaShieldAlt className="admin-icon" />
          Admin Dashboard
        </h1>
      </div>
      
      {/* Desktop Navigation */}
      <div className="container desktop-nav">
        <ul className="nav">
          <li className="nav-item me-4">
            <button 
              className="nav-link px-2 pb-3 d-flex align-items-center"
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
              <FaNewspaper className="nav-icon" />
              Articles
            </button>
          </li>
          <li className="nav-item me-4">
            <button 
              className="nav-link px-2 pb-3 d-flex align-items-center"
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
              <FaUsers className="nav-icon" />
              Users
            </button>
          </li>
          <li className="nav-item me-4">
            <button 
              className="nav-link px-2 pb-3 d-flex align-items-center"
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
              <FaPenNib className="nav-icon" />
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
      
      {/* Mobile Filter */}
      {isMobile && (
        <div className="container position-relative">
          <button 
            className="mobile-filter-button"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            aria-label="Toggle filter menu"
          >
            <div className="d-flex align-items-center">
              <FaFilter className="me-2" />
              <span>Filter: {getCurrentFilter()}</span>
            </div>
            <FaAngleDown style={{ 
              transform: showMobileFilter ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }} />
          </button>
          
          {showMobileFilter && (
            <div className="mobile-filter-menu">
              <button 
                className={`mobile-filter-item ${isActive('articles') ? 'active' : ''}`}
                onClick={() => handleTabClick('articles')}
              >
                <FaNewspaper className="me-3" />
                Articles
              </button>
              <button 
                className={`mobile-filter-item ${isActive('users') ? 'active' : ''}`}
                onClick={() => handleTabClick('users')}
              >
                <FaUsers className="me-3" />
                Users
              </button>
              <button 
                className={`mobile-filter-item ${isActive('authors') ? 'active' : ''}`}
                onClick={() => handleTabClick('authors')}
              >
                <FaPenNib className="me-3" />
                Authors
              </button>
            </div>
          )}
          
          {/* Mobile horizontal divider */}
          <hr style={{ 
            borderTop: '1px solid #333333',
            margin: '0 0 15px 0',
            opacity: '0.5'
          }} />
        </div>
      )}
      
      {/* Content area with container */}
      <div className="container py-4">
        {/* Loading spinner when first loading */}
        {isLoading && !isActive('users') && !isActive('authors') && (
          <div className="text-center py-5">
            <FaSpinner className="text-warning mb-3" size={40} style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-white">Loading content...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        
        {/* Conditionally render skeletons based on which tab is active and loading state */}
        {isLoading && isActive('users') && (
          <div>
            <h2 className="text-white mb-4 d-flex align-items-center">
              <FaUsers className="me-2" /> Users
            </h2>
            {[1, 2, 3, 4].map((item) => (
              <UserSkeleton key={item} />
            ))}
          </div>
        )}
        
        {isLoading && isActive('authors') && (
          <div>
            <h2 className="text-white mb-4 d-flex align-items-center">
              <FaPenNib className="me-2" /> Authors
            </h2>
            {[1, 2, 3].map((item) => (
              <AuthorSkeleton key={item} />
            ))}
          </div>
        )}
        
        {/* Render actual content when not loading */}
        {!isLoading && <Outlet />}
      </div>
    </div>
  );
}

export default AdminProfile;
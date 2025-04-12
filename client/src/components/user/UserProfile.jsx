import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IoFilterOutline } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";
import { IoArrowBackOutline } from "react-icons/io5";

function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isReadingArticle, setIsReadingArticle] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Add global style for dropdown options
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      select option {
        background-color: #1a1a1a !important;
        color: white !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  useEffect(() => {
    if (
      location.pathname.includes('/article/') ||
      location.pathname.match(/\/articles\/\d+/) || 
      location.pathname.match(/\/\d+$/) ||   
      location.pathname.includes('/read-more')
    ) {
      setIsReadingArticle(true);
    } else {
      setIsReadingArticle(false);
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate('articles', {
        state: {
          searchQuery: e.target.value,
          selectedCategory: selectedCategory
        }
      });
    }
  };
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    navigate('articles', {
      state: {
        searchQuery: searchQuery,
        selectedCategory: e.target.value
      }
    });
  };
  
  const handleBackClick = () => {
    navigate('articles', { replace: true });
  };

  return (
    <div className="user-profile mt-4 container">
      {isReadingArticle ? (
        // Show back button when reading an article
        <div className="mb-4 px-2">
          <div className="row">
            <div className="col-12">
              <button 
                className="btn btn-outline-warning d-flex align-items-center"
                onClick={handleBackClick}
              >
                <IoArrowBackOutline size={18} className="me-2" />
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Show filter options when not reading an article
        <div className="row px-2 mb-0 g-3">
          {/* Category filter */}
          <div className="col-12 col-sm-5">
            <div className="input-group align-items-center" style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "8px",
              height: "42px"
            }}>
              <span className="input-group-text bg-transparent border-0">
                <IoFilterOutline className="text-warning" size={20} />
              </span>
              <select
                id="category"
                className="form-select bg-transparent text-secondary border-0 shadow-none"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  height: "100%",
                  paddingLeft: "0",
                  backgroundColor: "#1a1a1a"
                }}
              >
                <option value="all">All Categories</option>
                <option value="programming">Programming</option>
                <option value="AI&ML">AI & ML</option>
                <option value="database">Database</option>
              </select>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="col-12 col-sm-7">
            <div className="input-group align-items-center" style={{
              backgroundColor: "#1a1a1a",
              border: searchFocused ? "1px solid #ffc107" : "1px solid #444",
              borderRadius: "8px",
              height: "42px"
            }}>
              <span className="input-group-text bg-transparent border-0">
                <BiSearchAlt className="text-warning" size={20} />
              </span>
              <input
                type="text"
                className="form-control bg-transparent text-white border-0 shadow-none"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  height: "100%"
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      <hr className="mt-3" />
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
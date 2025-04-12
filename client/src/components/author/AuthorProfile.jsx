import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IoFilterOutline } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";
import { IoArrowBackOutline } from "react-icons/io5";

function AuthorProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPostingArticle, setIsPostingArticle] = useState(false);
  const [isReadingArticle, setIsReadingArticle] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  
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
  
  // This useEffect will run whenever the location changes
  useEffect(() => {
    // Check if we're on the article posting page
    if (location.pathname.endsWith('/article')) {
      setIsPostingArticle(true);
      setIsReadingArticle(false);
    } 
    // Check if we're reading a specific article
    // Enhanced pattern matching to catch all possible "read more" scenarios
    else if (
      location.pathname.match(/\/articles\/\d+/) || 
      location.pathname.match(/\/\d+$/) ||  // Check for paths ending with a number
      location.pathname.includes('/read-more') ||
      location.pathname.includes('/article/') ||
      (location.state && location.state.isReadingArticle)
    ) {
      setIsReadingArticle(true);
      setIsPostingArticle(false);
    } 
    else {
      setIsPostingArticle(false);
      setIsReadingArticle(false);
    }
  }, [location.pathname, location.state]);

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
  
  const handlePostArticleClick = () => {
    setButtonClicked(true);
    navigate('article');
    
    // Reset button state after animation
    setTimeout(() => {
      setButtonClicked(false);
    }, 300);
  };
  
  const handleBackClick = () => {
    navigate('articles');
  };
  
  return (
    <div className="author-profile mt-4 container">
      {isPostingArticle || isReadingArticle ? (
        // Show back button when posting or reading an article
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
        // Show filter options when not posting or reading an article
        <div className="row px-2 mb-0 g-3">
          {/* Category filter */}
          <div className="col-12 col-sm-4">
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
          <div className="col-12 col-sm-5">
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
          
          {/* Post Article Button with Enhanced States */}
          <div className="col-12 col-sm-3 d-flex justify-content-sm-end">
            <button
              className="btn w-100 w-sm-auto"
              onClick={handlePostArticleClick}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              style={{
                // When clicked: blue background, when normal: body background
                background: buttonClicked ? '#3b82f6' : buttonHovered ? '#242424' : '#1a1a1a',
                // When clicked: white text, when normal: blue text
                color: buttonClicked ? 'white' : '#3b82f6',
                fontWeight: "bold",
                padding: "8px 15px",
                borderRadius: "8px",
                border: buttonHovered && !buttonClicked ? "1px solid #3b82f6" : "none",
                boxShadow: buttonClicked 
                  ? "0 2px 4px rgba(0,0,0,0.3)" 
                  : buttonHovered 
                    ? "0 4px 8px rgba(59,130,246,0.3)" 
                    : "0 4px 8px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease-in-out",
                transform: buttonClicked ? "translateY(2px)" : "translateY(0)",
                height: "42px"
              }}
            >
              Add New Article
            </button>
          </div>
        </div>
      )}
      
      <hr className="mt-3" />
      <div className="mt-4 px-2">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;
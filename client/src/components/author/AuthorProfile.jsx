import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { IoFilterOutline } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";

function AuthorProfile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
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
  
  return (
    <div className="author-profile mt-5 container" >
      <div className="mb-4 px-3">
        <div className="row align-items-center">
          {/* Category filter */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <IoFilterOutline className='text-warning me-2'/>
              <select
                id="category"
                className="form-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "8px"
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
          <div className="col-md-5 mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <BiSearchAlt className='text-warning me-2' size={20}/>
              <input 
                type="text"
                className="form-control"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: "8px"
                }}
              />
            </div>
          </div>
          
          {/* Post Article Button */}
          <div className="col-md-3 d-flex justify-content-md-end">
            <button
              className="btn w-100 w-md-auto"
              onClick={() => navigate('article')}
              style={{
                background: "linear-gradient(45deg, goldenrod, #1e3a8a)",
                color: "white",
                fontWeight: "bold",
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
              }}
            >
              Post Article
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-5 px-2">
        <Outlet/>
      </div>
    </div>
  );
}

export default AuthorProfile;
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { IoFilterOutline } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";

function UserProfile() {
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
    <div className="user-profile mt-5 container">
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
        </div>
      </div>

       {/* <ul className="d-flex justify-content-around list-unstyled mt-4 fs-3">
        <li className='nav-item'>
          <NavLink to='articles' className='nav-link bg-light'>Articles</NavLink>
        </li>
      </ul>  */}
      
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
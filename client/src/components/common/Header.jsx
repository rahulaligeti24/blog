import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
//import { FaUserCircle } from "react-icons/fa";
import { GiBrain } from 'react-icons/gi';
import { BiLogOut } from "react-icons/bi";
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoCloseOutline } from 'react-icons/io5';
import './Header.css';

function Header() {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [profileDetailsOpen, setProfileDetailsOpen] = useState(false);
  const profileDetailsRef = useRef(null);
  
  const handleSignOut = async () => {
    console.log("Sign-out called");
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      navigate('/');
      setProfileDetailsOpen(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };
  
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };
  
  const toggleProfileDetails = () => {
    setProfileDetailsOpen(!profileDetailsOpen);
  };
  
  // Close profile details when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDetailsRef.current && !profileDetailsRef.current.contains(event.target) && 
          !event.target.classList.contains('profile-image') && 
          !event.target.classList.contains('avatar-circle')) {
        setProfileDetailsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <GiBrain className="brand-icon" />
            <div className="brand-text">
              <span className="inspire-text">Inspire</span>
              <span className="hub-text">Hub</span>
            </div>
          </Link>
          
          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNav}
            aria-label="Toggle navigation"
          >
            <GiHamburgerMenu className="hamburger-icon" />
          </button>
          
          <div className={`navbar-collapse ${navOpen ? 'show' : ''}`}>
            <div className="navbar-nav ms-auto">
              {!isSignedIn ? (
                <div className="auth-buttons">
                  <Link className="nav-item sign-in-btn mobile-no-border" to="/signin" onClick={() => setNavOpen(false)}>SIGN IN</Link>
                  <Link className="nav-item sign-up-btn mobile-no-border" to="/signup" onClick={() => setNavOpen(false)}>SIGN UP</Link>
                </div>
              ) : (
                <div className="user-profile-nav">
                  <div className="user-info">
                    {/* {currentUser?.role && (
                      <span className="user-role-badge">
                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      </span>
                    )} */}
                    <span className="user-name">
                      {user?.imageUrl ? (
                        <img 
                          src={user.imageUrl} 
                          alt="Profile" 
                          className="profile-image" 
                          onClick={toggleProfileDetails}
                        />
                      ) : (
                        <div 
                          className="avatar-circle" 
                          onClick={toggleProfileDetails}
                        >
                          {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                      
                    </span>
                  </div>
                  <button className="sign-out-btn" onClick={handleSignOut}>
                    <BiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Profile Details Panel */}
      {isSignedIn && (
        <div 
          ref={profileDetailsRef}
          className={`profile-details-panel ${profileDetailsOpen ? 'open' : ''}`}
        >
          <div className="profile-details-header">
            <h2>Profile Details</h2>
            <button className="close-button" onClick={toggleProfileDetails}>
              <IoCloseOutline />
            </button>
          </div>
          
          <div className="profile-avatar-container">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="profile-details-avatar" />
            ) : (
              <div className="profile-details-avatar-circle">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
          </div>
          
          <h3 className="profile-details-name">
            {user?.firstName} {user?.lastName}
          </h3>
          
          {/* Added role badge in profile details panel */}
          {currentUser?.role && (
            <div className="profile-details-role">
              <span className="profile-role-badge">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
            </div>
          )}
          
          <div className="profile-details-info">
            <div className="info-item">
              <label>Name</label>
              <p>{user?.firstName} {user?.lastName}</p>
            </div>
            
            <div className="info-item">
              <label>Email</label>
              <p>{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
          
          <button className="sign-out-button" onClick={handleSignOut}>
            <BiLogOut /> Sign Out
          </button>
        </div>
      )}
      
      {/* Overlay when profile panel is open */}
      {profileDetailsOpen && <div className="profile-details-overlay" onClick={() => setProfileDetailsOpen(false)}></div>}
    </>
  );
}

export default Header;
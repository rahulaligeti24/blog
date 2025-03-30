import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { FaPenNib, FaUserCircle } from "react-icons/fa";
import { IoRocketOutline } from 'react-icons/io5';
import { TbNetwork } from 'react-icons/tb';
import { GiBrain } from 'react-icons/gi';
import { FaMountain } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
//import { SiAppstore } from "react-icons/si";
import { FaLightbulb } from 'react-icons/fa';
import {Sparkles} from 'lucide-react'
import { MdAutoAwesome} from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi'; // Add hamburger icon
import './Header.css';

function Header() {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false); // State for mobile menu toggle

  const handleSignOut = async () => {
    console.log("Sign-out called");
    try {
      await signOut();
      setCurrentUser(null);
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <MdAutoAwesome className="brand-icon" />
          <span className="brand-text">InspireHub</span>
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
                <Link className="nav-item sign-in-btn" to="/signin" onClick={() => setNavOpen(false)}>SIGN IN</Link>
                <Link className="nav-item sign-up-btn" to="/signup" onClick={() => setNavOpen(false)}>SIGN UP</Link>
              </div>
            ) : (
              <div className="user-profile-nav">
                <div className="user-info">
                  {currentUser?.role && (
                    <span className="user-role-badge">
                      {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </span>
                  )}
                  <span className="user-name">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Profile" className="profile-image" />
                    ) : (
                      <FaUserCircle className="default-avatar" />
                    )}
                    {user?.firstName}
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
  );
}

export default Header;
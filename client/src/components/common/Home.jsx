import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { FaPenAlt, FaBookReader,FaLock, FaFolderOpen } from 'react-icons/fa'
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiBootstrap, SiGithub } from 'react-icons/si'
import { RiAdminFill } from 'react-icons/ri'
import './Home.css'

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  async function onSelectRole(e) {
    // Clear error property
    setError('')
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('https://blog-v9w3.onrender.com/author-api/author', currentUser)
        let { message, payload } = res.data;
        if (message === 'author') {
          // Check if author is active
          if (payload.isActive === false) {
            setError("Your account has been blocked by an admin. Please contact support for assistance.");
            return;
          }
          
          // Ensure isActive is set to true when unblocked
          payload.isActive = payload.isActive === undefined ? true : payload.isActive;
          
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentUser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      
      if (selectedRole === 'user') {
        res = await axios.post('https://blog-v9w3.onrender.com/user-api/user', currentUser)
        let { message, payload } = res.data;
        if (message === 'user') {
          // Check if user is active
          if (payload.isActive === false) {
            setError("Your account has been blocked by an admin. Please contact support for assistance.");
            return;
          }
          
          // Ensure isActive is set to true when unblocked
          payload.isActive = payload.isActive === undefined ? true : payload.isActive;
          
          setCurrentUser({ ...currentUser, ...payload })
          localStorage.setItem("currentUser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
      
      if(selectedRole === 'admin'){
        res = await axios.post('https://blog-v9w3.onrender.com/admin-api/admin', currentUser)
        let {message, payload} = res.data;
        
        if(message === "admin"){
          // Admin accounts should always be active
          payload.isActive = true;
          
          setCurrentUser({...currentUser, ...payload})
          localStorage.setItem("currentUser", JSON.stringify(payload))
        } else {
          setError(message);
        }
      }
    } catch (err) {
      console.log("err is ", err);
      setError(err.message);
    }
  }

  // Check local storage at startup for previously saved user data
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Refresh user status from server to get latest isActive status
        if (parsedUser.role) {
          axios.get(`https://blog-v9w3.onrender.com/${parsedUser.role}-api/${parsedUser.role}/${parsedUser.email}`)
            .then(response => {
              const { payload } = response.data;
              if (payload && payload.isActive !== undefined) {
                // Update local storage with latest status
                parsedUser.isActive = payload.isActive;
                localStorage.setItem("currentUser", JSON.stringify(parsedUser));
              }
            })
            .catch(err => console.log("Error refreshing user status:", err));
        }
      } catch (e) {
        console.log("Error parsing saved user:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded])


  useEffect(() => {
    // Only navigate if user is active and there are no errors
    if (currentUser?.role === "user" && error.length === 0 && currentUser?.isActive !== false) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0 && currentUser?.isActive !== false) {
      navigate(`/author-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "admin" && currentUser.email && error.length === 0) {
      navigate(`/admin-profile/${currentUser.email}`);
    }    
  }, [currentUser]);

  return  (
    <div className="responsive-container">
      {isSignedIn === false && (
        <>
          {/* Hero Section - Enhanced for Responsiveness */}
          <div className="hero-section">
            <div className="hero-content container">
              <div className="brand-logo">
                <span className="logo-icon">&#10022;</span> <span className="logo-text">InspireHub</span>
              </div>
              <h1 className="hero-title">Where ideas flourish and connections thrive</h1>
              <p className="hero-subtitle">Discover a world where knowledge meets creativity.</p>
               
              <div className="cta-buttons">
                <Link to="/signup" className="btn-primary get-started-btn">Get Started</Link>
              </div>
            </div>
            <div className="scroll-indicator">
              <p>Scroll to explore</p>
              <span className="scroll-arrow">&#x25BC;</span>
            </div>
          </div>

          {/* Features Section - Enhanced for Responsiveness */}
          <div className="features-section">
            <div className="container">
              <h2 className="section-title">Platform Features</h2>
              <p className="section-subtitle">Our platform offers specialized features for readers, writers, and administrators</p>
              
              <div className="features-container">
                {/* For Authors */}
                <div className="feature-card">
                  <div className="feature-icon mx-auto">
                    <FaPenAlt />
                  </div>
                  <h3 className="feature-title mx-auto">For Authors</h3>
                  <p className="feature-description">
                    Powerful writing tools with SEO optimization, analytics, and audience insights to help grow your readership.
                  </p>
                </div>
                
                {/* For Readers */}
                <div className="feature-card">
                  <div className="feature-icon mx-auto">
                    <FaBookReader />
                  </div>
                  <h3 className="feature-title mx-auto">For Readers</h3>
                  <p className="feature-description">
                    Personalized content recommendations, bookmarking features, and interactive discussions with your favorite authors.
                  </p>
                </div>
                
                {/* For Admins */}
                <div className="feature-card">
                  <div className="feature-icon mx-auto">
                    <RiAdminFill />
                  </div>
                  <h3 className="feature-title mx-auto">For Admins</h3>
                  <p className="feature-description">
                    Comprehensive dashboard with user management, content moderation, and detailed platform analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section - Enhanced for Responsiveness */}
          <div className="tech-stack-section">
            <div className="container">
              <h2 className="section-title">Our Tech Stack</h2>
              <p className="section-subtitle">Built with modern technologies for performance, scalability, and reliability</p>
              
              <div className="tech-icons-container">
                <div className="tech-icon">
                  <SiReact className="icon-symbol" />
                  <span className="icon-name">React</span>
                </div>
                <div className="tech-icon">
                  <SiNodedotjs className="icon-symbol" />
                  <span className="icon-name">Node.js</span>
                </div>
                <div className="tech-icon">
                  <SiExpress className="icon-symbol" />
                  <span className="icon-name">Express</span>
                </div>
                <div className="tech-icon">
                  <SiMongodb className="icon-symbol" />
                  <span className="icon-name">MongoDB</span>
                </div>
                <div className="tech-icon">
                  <SiBootstrap className="icon-symbol" />
                  <span className="icon-name">Bootstrap</span>
                </div>
                <div className="tech-icon">
                  <span className="icon-symbol clerk-icon">C</span>
                  <span className="icon-name">Clerk</span>
                </div>
                <div className="tech-icon">
                  <SiGithub className="icon-symbol" />
                  <span className="icon-name">GitHub</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Enhanced for Responsiveness */}
          <footer className="footer">
            <div className="container">
              <div className="footer-sections ">
                <div className="footer-section ">
                  <h3 className="footer-title">InSpireHub</h3>
                  <p className="footer-description text-secondary">
                    A platform for writers, readers,<br className="d-none d-md-block" />
                    and knowledge seekers to connect, share,<br className="d-none d-md-block" />
                    and grow together.
                  </p>
                </div>
                
                <div className="footer-section">
                  <h3 className="footer-title">Projects</h3>
                  <div className="footer-links text-secondary">
                    <Link to="https://lumora-web.netlify.app/ ">LUMORA</Link>
                    <Link to="/projects/proje">project-2</Link>
                  </div>
                </div>
                
                <div className="footer-section">
                  <h3 className="footer-title">Contact</h3>
                  <p className="contact-email text-secondary">aligetirahul24@gmail.com</p>
                  <div className="social-icons d-flex gap-2">
                    <a href="#" className="social-icon github-icon"><SiGithub /></a>
                    <a href="#" className="social-icon instagram-icon">In</a>
                    <a href="#" className="social-icon linkedin-icon">Li</a>
                  </div>
                </div>
              </div>
              <hr className='bg-secondary mt-5'/>
              <div className="footer-bottom">
                <p className="copyright text-center">© 2025 InSpireHub. All rights reserved</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Signed In View - Role Selection - Enhanced for Responsiveness */}
      {isSignedIn === true && (
        <div className="container py-4">
          <div className="role-selection-container">
            <div className="user-card">
              <img src={user.imageUrl} className="user-image" alt="User profile" />
              <h2 className="user-name">{user.firstName} {user.lastName}</h2>
              <p className="user-email">{user.emailAddresses[0].emailAddress}</p>
            </div>
            
            <div className="role-selection">
              <h3 className="role-title">Select your role</h3>
              {error.length !== 0 && (
                <p className="error-message">{error}</p>
              )}
              
              <div className="role-options">
                <div className="role-option">
                  <input type="radio" name="role" id="author" value="author" className="role-input" onChange={onSelectRole} />
                  <label htmlFor="author" className="role-label">
                    <FaPenAlt className="role-icon" />
                    <span className="role-name">Author</span>
                    <span className="role-description">Create and publish content</span>
                  </label>
                </div>
                
                <div className="role-option">
                  <input type="radio" name="role" id="user" value="user" className="role-input" onChange={onSelectRole} />
                  <label htmlFor="user" className="role-label">
                    <FaBookReader className="role-icon" />
                    <span className="role-name">User</span>
                    <span className="role-description">Discover and interact with content</span>
                  </label>
                </div>
                
                <div className="role-option">
                  <input type="radio" name="role" id="admin" value="admin" className="role-input" onChange={onSelectRole} />
                  <label htmlFor="admin" className="role-label">
                    <RiAdminFill className="role-icon" />
                    <span className="role-name">Admin</span>
                    <span className="role-description">Manage platform and users</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
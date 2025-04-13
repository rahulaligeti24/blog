import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { FaPenAlt, FaBookReader, FaLock, FaFolderOpen } from 'react-icons/fa'
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiBootstrap, SiGithub } from 'react-icons/si'
import { RiAdminFill } from 'react-icons/ri'
import './Home.css'

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [animateHero, setAnimateHero] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
 
  async function onSelectRole(e) {
    // Clear error property
    setError('')
    const role = e.target.value;
    setSelectedRole(role);
    
    // Add animation to selection
    const label = document.querySelector(`label[for="${role}"]`);
    if (label) {
      label.classList.add('selected-role-animation');
      setTimeout(() => {
        processRoleSelection(role);
      }, 800); // Wait for animation to complete
    } else {
      processRoleSelection(role);
    }
  }
  
  const processRoleSelection = async (selectedRole) => {
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
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);  // Show the actual backend message
    } else {
        setError("Something went wrong. Please try again.");
    }

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
    
    // Start animations when component mounts - only for hero section
    setTimeout(() => setAnimateHero(true), 300);
    
    // Handle scroll animation for the hero section
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && scrollPosition < 300) {
        heroContent.style.opacity = 1 - (scrollPosition / 400);
        heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* Add animation styles - removed animations for features and tech stack */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes glow {
            0% {
              box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
            }
            50% {
              box-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
            }
            100% {
              box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
            }
          }
          
          .hero-content {
            transition: opacity 0.3s, transform 0.3s;
          }
          
          .hero-animation {
            opacity: 0;
            animation: fadeInUp 1s forwards;
          }
          
          .scroll-arrow {
            animation: bounce 2s infinite;
          }
          
          .get-started-btn {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .get-started-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 7px 14px rgba(0,0,0,0.2);
          }
          
          .get-started-btn:active {
            transform: translateY(1px);
          }
          
          .get-started-btn::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150%;
            height: 150%;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.5s;
          }
          
          .get-started-btn:hover::after {
            transform: translate(-50%, -50%) scale(1);
          }
          
          .brand-logo {
            display: inline-block;
          }
          
          .logo-icon {
            display: inline-block;
            animation: spin 10s linear infinite;
          }
          
          .selected-role-animation {
            animation: glow 1.5s;
          }
          
          .role-option {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .role-option:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          
          .user-card {
            animation: fadeInUp 0.8s;
          }
          
          .user-image {
            animation: float 5s ease-in-out infinite;
          }
          
          .role-selection-container {
            animation: fadeInUp 0.8s;
          }
        `}
      </style>

      {isSignedIn === false && (
        <>
          {/* Hero Section - Animation Kept */}
          <div className="hero-section">
            <div className={`hero-content container ${animateHero ? 'hero-animation' : ''}`}>
             
              <h1 className="hero-title">  Explore, write, and connect with a community of passionate authors.</h1>
               <div>
               <p className="hero-subtitle"> Connect with talented writers, follow their work, and engage in meaningful <br />discussions by commenting and sharing your thoughts.

                   </p>
               </div>
               
              <div className="cta-buttons">
                <Link to="/signup" className="btn-primary get-started-btn ">Get Started</Link>
              </div>
            </div>
            <div className="scroll-indicator">
              <p>Scroll to explore</p>
              <span className="scroll-arrow">&#x25BC;</span>
            </div>
          </div>

          {/* Features Section - Animation Removed */}
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

          {/* Tech Stack Section - Animation Removed */}
          <div className="tech-stack-section">
            <div className="container">
              <h2 className="section-title">Our Tech Stack</h2>
              <p className="section-subtitle">Built with modern technologies for performance, scalability, and reliability</p>
              
              <div className="tech-icons-container">
                {[
                  { icon: <SiReact className="icon-symbol" />, name: "React" },
                  { icon: <SiNodedotjs className="icon-symbol" />, name: "Node.js" },
                  { icon: <SiExpress className="icon-symbol" />, name: "Express" },
                  { icon: <SiMongodb className="icon-symbol" />, name: "MongoDB" },
                  { icon: <SiBootstrap className="icon-symbol" />, name: "Bootstrap" },
                  { icon: <span className="icon-symbol clerk-icon">C</span>, name: "Clerk" },
                  { icon: <SiGithub className="icon-symbol" />, name: "GitHub" }
                ].map((tech, index) => (
                  <div 
                    key={tech.name}
                    className="tech-icon"
                  >
                    {tech.icon}
                    <span className="icon-name">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - Enhanced for Responsiveness */}
          <footer className="footer">
            <div className="container">
              <div className="footer-sections ">
                <div className="footer-section ">
                  <h3 className="footer-title">InspireHub</h3>
                  <p className="footer-description text-secondary">
                    A platform for writers, readers,and<br className="d-none d-md-block" />
                     knowledge seekers to connect, share,<br className="d-none d-md-block" />
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
                    <a href="https://github.com/rahulaligeti24" className="social-icon github-icon"><SiGithub /></a>
                    <a href="https://www.instagram.com/rahul_aligeti24/" className="social-icon instagram-icon">In</a>
                    <a href="https://www.linkedin.com/in/rahul-aligeti-1ab6ab308/" className="social-icon linkedin-icon">Li</a>
                  </div>
                </div>
              </div>
              <hr className='bg-secondary mt-5'/>
              <div className="footer-bottom">
                <p className="copyright text-seconadry ">© 2025 InSpireHub. All rights reserved.Designed by Rahul Aligeti</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Signed In View - Role Selection - Animation Kept */}
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
                <div className={`role-option ${selectedRole === "author" ? "selected-role" : ""}`}>
                  <input type="radio" name="role" id="author" value="author" className="role-input" onChange={onSelectRole} />
                  <label htmlFor="author" className="role-label">
                    <FaPenAlt className="role-icon" />
                    <span className="role-name">Author</span>
                    <span className="role-description">Create and publish content</span>
                  </label>
                </div>
                
                <div className={`role-option ${selectedRole === "user" ? "selected-role" : ""}`}>
                  <input type="radio" name="role" id="user" value="user" className="role-input" onChange={onSelectRole} />
                  <label htmlFor="user" className="role-label">
                    <FaBookReader className="role-icon" />
                    <span className="role-name">User</span>
                    <span className="role-description">Discover and interact with content</span>
                  </label>
                </div>
                
                <div className={`role-option ${selectedRole === "admin" ? "selected-role" : ""}`}>
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
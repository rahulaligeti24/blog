import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'

function Articles() {
  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('') 
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(userAuthorContextObj)
  
  const { getToken } = useAuth();
  const [filteredArticles, setFilteredArticles] = useState([])
  
  // These state values will now be managed by the parent AuthorProfile component
  // We'll get them through props or location.state
  const selectedCategory = location.state?.selectedCategory || "all";
  const searchTerm = location.state?.searchQuery || "";
  
  async function getArticles() {
    setLoading(true)
    try {
      const token = await getToken()
      let res = await axios.get(`https://blog-v9w3.onrender.com/author-api/articles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.data.message === 'articles') {
        setArticles(res.data.payload)
        setFilteredArticles(res.data.payload) 
        setError('')
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to fetch articles')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  
  
  // Get user role from context or localStorage instead of API call
  useEffect(() => {
    // Set the role from the context
    if (currentUser && currentUser.role) {
      setUserRole(currentUser.role);
    } else {
      // Fallback to check localStorage
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.role) {
            setUserRole(parsedUser.role);
          }
        } catch (e) {
          console.log("Error parsing saved user:", e);
        }
      }
    }
  }, [currentUser]);
  
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj })
  }
  
  const filterArticles = () => {
    let result = articles;

    if (selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.content.toLowerCase().includes(term) ||
        article.authorData.nameOfAuthor.toLowerCase().includes(term)
      );
    }

    setFilteredArticles(result);
  }

  useEffect(() => {
    getArticles()
    // getUserRole() is removed from here
  }, [])
  
  useEffect(() => {
    filterArticles();
  }, [articles, selectedCategory, searchTerm]);
  
  // Skeleton loader card - Fixed DOM nesting issue
  const SkeletonCard = () => (
    <div className='col'>
      <div className='card h-100 d-flex flex-column' style={{
        backgroundColor: "#1a1a1a", 
        border: '0px solid #4a90e2',
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        position: "relative"
      }}>
        <div className="skeleton-category" style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          height: "24px",
          width: "80px",
          backgroundColor: "#333",
          borderRadius: "4px",
          animation: 'pulse 1.5s infinite ease-in-out'
        }}></div>
        <div className='card-body d-flex flex-column' style={{ marginTop: "25px" }}>
          <div className="author-details text-end">
            <div className="skeleton-circle" style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#333',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}></div>
            {/* Fixed: Removed <p> tag that contained <div> */}
            <div className="mt-2">
              <div className="skeleton-text" style={{
                height: '12px',
                width: '80px',
                backgroundColor: '#333',
                marginTop: '8px',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}></div>
            </div>
          </div>
          <div className="skeleton-title" style={{
            height: '28px',
            backgroundColor: '#333',
            marginBottom: '12px',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}></div>
          <div className="skeleton-text" style={{
            height: '80px',
            backgroundColor: '#333',
            marginBottom: '16px',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}></div>
          <div className="mt-auto">
            <div className="skeleton-button" style={{
              height: '38px',
              width: '100px',
              backgroundColor: '#333',
              borderRadius: '8px',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}></div>
          </div>
        </div>
        <div className="card-footer" style={{backgroundColor: "#0f0f0f"}}>
          <div className="skeleton-text" style={{
            height: '12px',
            width: '180px',
            backgroundColor: '#333',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}></div>
        </div>
      </div>
    </div>
  )
  
  return (
    <div>
      {error.length !== 0 && <p className='display-4 text-center text-danger'>{error}</p>}
      
      {filteredArticles.length === 0 && !error && !loading && (
        <div className="text-center mt-4">
          <p className="text-secondary">No articles found matching your criteria.</p>
        </div>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.8; }
            100% { opacity: 0.6; }
          }
          
          .read-more-btn {
            background-color: transparent;
            color: #4a90e2;
            border: 1px solid #4a90e2;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          
          .read-more-btn:hover {
            background-color: #4a90e2;
            color: white;
          }
          
          .category-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background-color: #292929;
            color: #4a90e2;
            font-size: 0.85rem;
            padding: 4px 10px;
            border-radius: 4px;
            z-index: 1;
          }
        `}
      </style>
          
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      {loading ? (
        // Show skeleton cards while loading
        Array(6).fill().map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
      ) : (
        // Show actual articles when loaded
        filteredArticles.map((articleObj) => 
          <div className='col' key={articleObj.articleId}>
            <div className='card h-100 d-flex flex-column' style={{
              backgroundColor: "#1a1a1a", 
              border: '0px solid #4a90e2',
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              position: "relative"
            }}>
              {/* Category badge at the top of the card */}
              <span className="category-badge">
                {articleObj.category}
              </span>
              
              <div className='card-body d-flex flex-column' style={{ marginTop: "25px" }}>
                <div className="author-details text-end">
                  <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt="" />
                  <p>
                    <small className='text-secondary'>
                      {articleObj.authorData.nameOfAuthor}
                    </small>
                  </p>
                </div>
                <h4 className='card-title' style={{color: "#4a90e2"}}>{articleObj.title}</h4>
                <p className='card-text'>
                  {articleObj.content.substring(0, 80) + "...."}
                </p>
                <div className="mt-auto">
                  <button className='btn read-more-btn' onClick={() => gotoArticleById(articleObj)}>
                    Read More
                  </button>
                </div>
              </div>
              <div className="card-footer" style={{backgroundColor: "#0f0f0f"}}>
                <small className='text-secondary'>
                  Last updated on {articleObj.dateOfModification}
                </small>
              </div>
            </div>
          </div>
        )
      )}
      </div>
    </div>
  )
}

export default Articles
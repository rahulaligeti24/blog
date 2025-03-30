import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'

function Articles() {
  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('') 
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
    try {
      const token = await getToken()
      let res = await axios.get(`https://blog-v9w3.onrender.com/author-api/articles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.data.message === 'articles') {
        setArticles(res.data.payload)
        setFilteredArticles(res.data.payload) // Initialize with all articles
        setError('')
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError('Failed to fetch articles')
      console.error(err)
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
  
  return (
    <div>
      {error.length !== 0 && <p className='display-4 text-center text-danger'>{error}</p>}
      
      {filteredArticles.length === 0 && !error && (
        <div className="text-center mt-4">
          <p className="text-secondary">No articles found matching your criteria.</p>
        </div>
      )}
          
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
      {filteredArticles.map((articleObj) => 
        <div className='col' key={articleObj.articleId}>
          <div className='card h-100 d-flex flex-column' style={{
            backgroundColor: "#1a1a1a", 
            border: '0px solid #4a90e2',
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}>
            <div className='card-body d-flex flex-column'>
              <div className="author-details text-end">
                <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt="" />
                <p>
                  <small className='text-secondary'>
                    {articleObj.authorData.nameOfAuthor}
                  </small>
                </p>
              </div>
              <h4 className='card-title' style={{color: "goldenrod"}}>{articleObj.title}</h4>
              <span className="badge mb-2" style={{
                textAlign:'left',
                color: "gold",
                fontSize: "0.8rem",  // Control the font size
              }}>
                {articleObj.category}
              </span>
              <p className='card-text'>
                {articleObj.content.substring(0, 80) + "...."}
              </p>
              <div className="mt-auto">
                <button className='btn' onClick={() => gotoArticleById(articleObj)} style={{
                  backgroundColor: "#4a90e2",
                  color: "white",
                  borderRadius: "8px"
                }}>
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
      )}
      </div>
    </div>
  )
}

export default Articles
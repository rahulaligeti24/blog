import { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useForm } from 'react-hook-form';
import { FaEdit, FaComment, FaPaperPlane, FaSave, FaTimes } from 'react-icons/fa';
import { MdDelete, MdRestore } from 'react-icons/md';
import { IoMdListBox } from "react-icons/io";
import { MdOutlineArticle, MdOutlinePostAdd } from "react-icons/md";
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { BsCardHeading } from 'react-icons/bs';

function ArticleByID() { 
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [currentComment, setCommentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputHover, setInputHover] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);
  

  // Load article data with skeleton effect
  useEffect(() => {
    // Simulate loading time for skeleton display
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Reload article data when comments are added
  useEffect(() => {
    const refreshArticleData = async () => {
      if (refreshComments) {
        try {
          const res = await axios.get(`https://blog-v9w3.onrender.com/author-api/article/${state.articleId}`);
          if (res.data.payload) {
            setCurrentArticle(res.data.payload);
            navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload }, { replace: true });
          }
        } catch (error) {
          console.error("Error refreshing article data:", error);
        }
        setRefreshComments(false);
      }
    };
    
    refreshArticleData();
  }, [refreshComments, state.articleId, navigate]);

  // Enable edit mode
  function enableEdit() {
    setEditArticleStatus(true);
  }

  // Save modified article
  async function OnSave(modifiedArticle) {
    const articleAfterChanges = { ...state, ...modifiedArticle };
    const token = await getToken();
    const currentDate = new Date();
    articleAfterChanges.dateOfModification = 
      `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    let res = await axios.put(
      `https://blog-v9w3.onrender.com/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.message === 'article modified') {
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload });
    }
  }

  

  // Delete article (soft delete)
  async function deleteArticle() {
    state.isArticleActive = false;
    let res = await axios.put(`https://blog-v9w3.onrender.com/author-api/articles/${state.articleId}`, state);
    if (res.data.message === 'article deleted or restored') {
      setCurrentArticle(res.data.payload);
    }
  }

  // Restore deleted article
  async function restoreArticle() {
    state.isArticleActive = true;
    let res = await axios.put(`https://blog-v9w3.onrender.com/author-api/articles/${state.articleId}`, state);
    if (res.data.message === 'article deleted or restored') {
      setCurrentArticle(res.data.payload);
    }
  }

  // Add comment
  async function addComment(commentObj) {
    try {
      setLoading(true); // Show loading state while adding comment
      commentObj.nameOfUser = currentUser.firstName;
      const res = await axios.put(
        `https://blog-v9w3.onrender.com/user-api/comment/${currentArticle.articleId}`,
        commentObj
      );

      if (res.data.message === "comment added") {
        setCommentStatus(res.data.message);
        reset(); // Clear the form after submission
        setRefreshComments(true); // Trigger article refresh 
      } else {
        alert("Failed to add comment. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      alert(error?.response?.data?.message || "An error occurred while adding the comment.");
      setLoading(false);
    }
  }

  // Check if the current user is the author of this article using email address
  const isOriginalAuthor = 
    currentUser.role === 'author' && 
    currentUser.email === state.authorData.email;

  // Check if the current user is admin
  const isAdmin = currentUser.role === 'admin';

  // Common input style (following PostArticle style)
  const inputStyle = {
    backgroundColor: "#121212",
    color: "white",
    border: "1px solid #333",
    borderRadius: "8px"
  };

  // Skeleton component for loading state
  const SkeletonLoader = () => (
    <div className="container py-4">
      {/* Header Skeleton */}
      <div className="mb-4">
        <div className="author-block w-100 px-3 py-3 rounded-2" 
             style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
          <div className="row">
            <div className="col-12 col-md-8 mb-3 mb-md-0">
              <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '60px', width: '80%' }}></div>
              <div className="py-2 d-flex">
                <div className="bg-secondary bg-opacity-25 rounded me-4" style={{ height: '20px', width: '150px' }}></div>
                <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '20px', width: '150px' }}></div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-start justify-content-md-end">
                <div className="bg-secondary rounded-circle me-2" style={{ width: '50px', height: '50px' }}></div>
                <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '24px', width: '100px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="row">
        <div className="col-12">
          <div className="p-3 mb-4" style={{ borderRadius: '10px', backgroundColor: '#1a1a1a' }}>
            <div className="bg-secondary bg-opacity-25 rounded mb-3" style={{ height: '24px', width: '90%' }}></div>
            <div className="bg-secondary bg-opacity-25 rounded mb-3" style={{ height: '24px', width: '80%' }}></div>
            <div className="bg-secondary bg-opacity-25 rounded mb-3" style={{ height: '24px', width: '85%' }}></div>
            <div className="bg-secondary bg-opacity-25 rounded mb-3" style={{ height: '24px', width: '75%' }}></div>
            <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '24px', width: '60%' }}></div>
          </div>
        </div>
      </div>

      {/* Comments Skeleton */}
      <div className="row">
        <div className="col-12">
          <div className="my-4" style={{ borderRadius: '8px', padding: '20px', backgroundColor: '#1a1a1a' }}>
            <div className="bg-secondary bg-opacity-25 rounded mb-4" style={{ height: '30px', width: '150px' }}></div>
            <div className="mb-4" style={{ borderLeft: '3px solid #333', paddingLeft: '15px' }}>
              <div className="bg-secondary bg-opacity-25 rounded mb-2" style={{ height: '20px', width: '100px' }}></div>
              <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '50px', width: '100%' }}></div>
            </div>
            <div style={{ borderLeft: '3px solid #333', paddingLeft: '15px' }}>
              <div className="bg-secondary bg-opacity-25 rounded mb-2" style={{ height: '20px', width: '120px' }}></div>
              <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '30px', width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className='container py-4'>
          {editArticleStatus === false ? (
            <>
              {/* Article Header - Now fully responsive */}
              <div className="mb-4">
                <div className="author-block w-100 px-3 py-3 rounded-2" 
                    style={{ backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
                  
                  <div className="row">
                    {/* Title and dates - Takes full width on mobile, col-md-8 on larger screens */}
                    <div className="col-12 col-md-8 mb-3 mb-md-0">
                      <h1 className="display-4 mb-2" style={{ color: 'white', fontSize: 'clamp(1.75rem, 5vw, 3.5rem)' }}>
                        {currentArticle.title}
                      </h1>
                      <div className="py-2">
                        <small className="text-secondary d-block d-sm-inline me-0 me-sm-4 mb-1 mb-sm-0">
                          Created on: {currentArticle.dateOfCreation}
                        </small>
                        <small className="text-secondary d-block d-sm-inline">
                          Modified on: {currentArticle.dateOfModification}
                        </small>
                      </div>
                    </div>

                    {/* Author details and action buttons - Takes full width on mobile, col-md-4 on larger screens */}
                    <div className="col-12 col-md-4">
                      <div className="d-flex flex-wrap align-items-center justify-content-start justify-content-md-end mt-2 mt-md-0">
                        <div className="d-flex align-items-center me-auto me-md-3">
                          <img 
                            src={currentArticle.authorData.profileImageUrl} 
                            width='50px' 
                            height='50px'
                            className='rounded-circle me-2 object-fit-cover' 
                            alt="Author" 
                          />
                          <p className="mb-0 text-white">{currentArticle.authorData.nameOfAuthor}</p>
                        </div>

                        {/* Action Buttons - Only show if user is the original author and NOT an admin */}
                        {isOriginalAuthor && !isAdmin && (
                          <div className="d-flex mt-2 mt-md-0">
                            <button className="btn btn-dark btn-sm me-2" onClick={enableEdit}>
                              <FaEdit className='text-warning' />
                            </button>

                            {currentArticle.isArticleActive ? (
                              <button className="btn btn-dark btn-sm" onClick={deleteArticle}>
                                <MdDelete className='text-danger fs-5' />
                              </button>
                            ) : (
                              <button className="btn btn-dark btn-sm" onClick={restoreArticle}>
                                <MdRestore className='text-info fs-5' />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="row">
                <div className="col-12">
                  <div className="lead p-3 mb-4" 
                    style={{ 
                      whiteSpace: 'pre-line', 
                      borderRadius: '10px', 
                      backgroundColor: '#1a1a1a', 
                      border: 'white',
                      color: '#fff',
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      lineHeight: '1.6'
                    }}>
                    {currentArticle.content}
                  </div>
                </div>
              </div>

              {/* Comments Section - Hide if user is admin */}
              {!isAdmin && (
                <div className="row">
                  <div className="col-12">
                    <div className="comments my-4" style={{ 
                      border: 'white',
                      borderRadius: '8px',
                      padding: '20px',
                      backgroundColor: '#1a1a1a'
                    }}>
                      <h3 style={{ color: 'white', marginBottom: '20px', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                        <FaComment className="me-2" style={{ color: 'goldenrod' }} />
                        Comments
                      </h3>
                      
                      {currentArticle.comments.length === 0 ? (
                        <p className="text-white-50">No Comments Yet</p>
                      ) : (
                        currentArticle.comments.map(commentObj => (
                          <div 
                            key={commentObj._id} 
                            style={{ 
                              borderLeft: '3px solid white',
                              paddingLeft: '15px',
                              marginBottom: '15px',
                              transition: 'all 0.3s ease'
                            }}
                            className="comment-item"
                          >
                            <p className='user-name' style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>
                              {commentObj?.nameOfUser}
                            </p> 
                            <p className='comment text-white-50'>{commentObj?.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Add Comment Form - Only for users and not for admins */}
              {currentUser.role === 'user' && !isAdmin && (
                <div className="row">
                  <div className="col-12">
                    <form 
                      onSubmit={handleSubmit(addComment)} 
                      style={{ 
                        backgroundColor: '#1a1a1a',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '2px'
                      }}
                    >
                      <input 
                        type="text" 
                        {...register("comment", { required: true })} 
                        className='form-control' 
                        placeholder="Write a comment..." 
                        style={{
                          ...inputStyle,
                          borderColor: inputHover ? 'white' : '#333',
                          boxShadow: inputHover ? '0 0 5px rgba(30, 144, 255, 0.3)' : 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={() => setInputHover(true)}
                        onMouseLeave={() => setInputHover(false)}
                      />
                      <div className="d-flex align-items-center mt-3">
                        <button 
                          className="btn d-flex align-items-center" 
                          style={{ 
                            backgroundColor: buttonHover ? '#1E90FF' : '141413',
                            color: "white",
                            fontWeight: "bold",
                            padding: "8px 20px",
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: buttonHover ? '0 0 8px rgba(30, 144, 255, 0.7)' : '0 0 5px rgba(218,165,32,0.5)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={() => setButtonHover(true)}
                          onMouseLeave={() => setButtonHover(false)}
                        >
                          Add Comment
                          <FaPaperPlane className="ms-2" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="row justify-content-center">
              <div className="col-lg-10 col-md-12">
                <div className="card shadow" style={{ 
                  backgroundColor: "black", 
                  borderRadius: "20px", 
                  border: "3px ",
                  overflow: "hidden"
                }}>
                  {/* Updated header with icons and no black bar */}
                  <div className="card-title text-center" style={{ 
                    borderBottom: "2px solid goldenrod",
                    background: "linear-gradient(45deg, rgba(25,25,25,1), rgba(40,40,40,1))"
                  }}>
                    <h2 className="p-3 d-flex align-items-center justify-content-center" style={{ 
                      color: "goldenrod",
                      textShadow: "0 0 5px rgba(218,165,32,0.5)",
                      margin: 0
                    }}>
                      <FaEdit className="me-2" /> Edit Article
                    </h2>
                  </div>
                  <div className="card-body" style={{ backgroundColor: "#141413", color: "white", padding: "30px" }}>
                    <form onSubmit={handleSubmit(OnSave)}>
                      <div className="mb-4">
                        <label htmlFor="title" className="form-label d-flex align-items-center" style={{ color: "goldenrod" }}>
                          <BsCardHeading className="me-2" /> Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          defaultValue={currentArticle.title}
                          style={inputStyle}
                          {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && <p className="text-danger">{errors.title.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="category" className="form-label d-flex align-items-center" style={{ color: "goldenrod" }}>
                          <IoMdListBox className="me-2" /> Select a category
                        </label>
                        <select
                          {...register("category", { required: "Category is required" })}
                          id="category"
                          className="form-select"
                          style={inputStyle}
                          defaultValue={currentArticle.category}
                        >
                          <option value="programming">Programming</option>
                          <option value="AI&ML">AI & ML</option>
                          <option value="database">Database</option>
                        </select>
                        {errors.category && <p className="text-danger">{errors.category.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="content" className="form-label d-flex align-items-center" style={{ color: "goldenrod" }}>
                          <MdOutlinePostAdd className="me-2" /> Content
                        </label>
                        <textarea
                          {...register("content", { required: "Content is required" })}
                          className="form-control"
                          id="content"
                          rows="10"
                          defaultValue={currentArticle.content}
                          style={inputStyle}
                        ></textarea>
                        {errors.content && <p className="text-danger">{errors.content.message}</p>}
                      </div>

                      <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-sm-end gap-3 my-4">
  <button 
    type="button" 
    className="btn d-flex align-items-center justify-content-center"
    onClick={() => setEditArticleStatus(false)}
    style={{
      backgroundColor: "#333",
      color: "red",
      padding: "12px 15px",
      borderRadius: "8px",
      minWidth: "120px",
      margin: "5px 0"
    }}
  >
    <FaTimes className="me-2" /> Cancel
  </button>
  <button 
    type="submit" 
    className="btn d-flex align-items-center justify-content-center" 
    style={{ 
      background: "goldenrod",
      color: "white",
      fontWeight: "bold",
      padding: "12px 15px",
      borderRadius: "8px",
      border: "none",
      boxShadow: "0 0 5px rgba(218,165,32,0.5)",
      minWidth: "160px",
      margin: "5px 0"
    }}
  >
    <FaSave className="me-2" /> Save Changes
  </button>
</div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

<style>{`
  .comment-item:hover {
    background-color: rgba(30, 144, 255, 0.05);
    border-left: 3px solid #1E90FF !important;
    cursor: pointer;
    transform: translateX(5px);
  }
`}</style>
    </>
  );
}

export default ArticleByID;
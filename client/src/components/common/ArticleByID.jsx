import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { MdDelete, MdRestore } from 'react-icons/md';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

function ArticleByID() { 
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [currentComment, setCommentStatus] = useState('');

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
      commentObj.nameOfUser = currentUser.firstName;
      const res = await axios.put(
        `https://blog-v9w3.onrender.com/user-api/comment/${currentArticle.articleId}`,
        commentObj
      );

      if (res.data.message === "comment added") {
        setCommentStatus(res.data.message);
        reset(); // Clear the form after submission
      } else {
        alert("Failed to add comment. Please try again.");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "An error occurred while adding the comment.");
    }
  }

  return (
    <div className='container'>
      {editArticleStatus === false ? (
        <>
          <div className="d-flex justify-content-between">
            <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center" 
                 style={{ backgroundColor: '#1a1a1a', border: '2px solid #4a90e2', borderRadius: '8px' }}>
              
              <div>
                <p className="display-3 me-4" style={{ color: '#1e90ff' }}>{state.title}</p>
                <span className="py-3">
                  <small className="text-secondary me-4">
                    Created on: {state.dateOfCreation}
                  </small>
                  <small className="text-secondary me-4">
                    Modified on: {state.dateOfModification}
                  </small>
                </span>
              </div>

              {/* Author details and action buttons */}
              <div className="author-details d-flex align-items-center">
                <img src={state.authorData.profileImageUrl} width='60px' className='rounded-circle me-3' alt="Author" />
                <p className="mb-0">{state.authorData.nameOfAuthor}</p>

                {currentUser.role === 'author' && (
                  <div className="d-flex ms-3">
                    {/* Edit Button */}
                    <button className="btn btn-dark me-2" onClick={enableEdit}>
                      <FaEdit className='text-warning' />
                    </button>

                    {/* Delete or Restore Button */}
                    {state.isArticleActive ? (
                      <button className="btn btn-dark me-2" onClick={deleteArticle}>
                        <MdDelete className='text-danger fs-4' />
                      </button>
                    ) : (
                      <button className="btn btn-dark" onClick={restoreArticle}>
                        <MdRestore className='text-info fs-4' />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="lead mt-3 p-3" 
             style={{ 
               whiteSpace: 'pre-line', 
               borderRadius: '10px', 
               backgroundColor: '#1a1a1a', 
               border: '2px solid #4a90e2',
               color: '#fff' 
             }}>
            {state.content}
          </p>

          {/* Comments Section */}
          <div className="comments my-4" style={{ 
            border: '2px solid #4a90e2',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#1a1a1a'
          }}>
            <h3 style={{ color: '#1e90ff', marginBottom: '20px' }}>Comments</h3>
            
            {state.comments.length === 0 ? (
              <p className='display-6'>No Comments Yet</p>
            ) : (
              state.comments.map(commentObj => (
                <div key={commentObj._id} style={{ 
                  borderLeft: '3px solid #4a90e2',
                  paddingLeft: '15px',
                  marginBottom: '15px'
                }}>
                  <p className='user-name' style={{ color: '#4a90e2', fontWeight: 'bold', marginBottom: '5px' }}>
                    {commentObj?.nameOfUser}
                  </p> 
                  <p className='comment'>{commentObj?.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form (Only for users) */}
          {currentUser.role === 'user' && (
            <form onSubmit={handleSubmit(addComment)} style={{ 
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #4a90e2'
            }}>
              <input 
                type="text" 
                {...register("comment")} 
                className='form-control' 
                placeholder="Write a comment..." 
                style={{ 
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '1px solid #4a90e2'
                }}
              />
              <button className="btn mt-3 mb-3" style={{ 
                backgroundColor: '#1e90ff',
                color: '#fff'
              }}>Add Comment</button>
            </form>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit(OnSave)} style={{ 
          backgroundColor: '#1a1a1a',
          padding: '20px', 
          borderRadius: '8px',
          border: '2px solid #4a90e2'
        }}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label" style={{ color: '#1e90ff' }}>Title</label>
            <input 
              type="text" 
              className="form-control" 
              id="title" 
              defaultValue={state.title} 
              {...register("title")} 
              style={{ 
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #4a90e2'
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="form-label" style={{ color: '#1e90ff' }}>Select a category</label>
            <select 
              {...register("category")} 
              id="category" 
              className="form-select" 
              defaultValue={state.category}
              style={{ 
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #4a90e2'
              }}
            >
              <option value="programming">Programming</option>
              <option value="AI&ML">AI & ML</option>
              <option value="database">Database</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="form-label" style={{ color: '#1e90ff' }}>Content</label>
            <textarea 
              {...register("content")} 
              className="form-control" 
              id="content" 
              rows="10" 
              defaultValue={state.content}
              style={{ 
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #4a90e2'
              }}
            ></textarea>
          </div>

          <div className="text-end">
            <button 
              type="submit" 
              className="btn" 
              style={{ 
                backgroundColor: '#4a90e2',
                color: '#fff'
              }}
            >Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ArticleByID;
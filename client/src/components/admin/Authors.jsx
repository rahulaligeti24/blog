import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdBlock, MdCheckCircle } from 'react-icons/md';
import { useAuth, useUser } from '@clerk/clerk-react';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // Default to show active users
  const { getToken } = useAuth();
  const { user } = useUser(); // To get the current admin email

  const fetchAuthors = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `http://localhost:3000/admin-api/authors?email=${user.primaryEmailAddress.emailAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.payload) {
        setAuthors(res.data.payload);
      } else {
        setError(res.data.message || 'Failed to load authors');
      }
    } catch (err) {
      setError('Failed to fetch authors');
    }
  };

  const updateAuthorStatus = async (email, isActive) => {
    try {
      const token = await getToken();

      await axios.put(
        `http://localhost:3000/admin-api/update-status/${email}`,
        {
          isActive,
          adminEmail: user.primaryEmailAddress.emailAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Author ${email} ${isActive ? 'unblocked' : 'blocked'} successfully`);

      setAuthors((prev) =>
        prev.map((a) =>
          a.email === email ? { ...a, isActive } : a
        )
      );
    } catch (err) {
      setError(`Failed to ${isActive ? 'unblock' : 'block'} author`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAuthors();
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Filter authors based on status
  const filteredAuthors = authors.filter(author => 
    (statusFilter === 'active' && author.isActive) || 
    (statusFilter === 'blocked' && !author.isActive)
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Authors</h2>
        <div className="d-flex align-items-center">
          <label htmlFor="statusFilter" className="me-2">Status:</label>
          <select 
            id="statusFilter"
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '130px' }}
          >
            <option value="active">Active Users</option>
            <option value="blocked">Blocked Users</option>
          </select>
        </div>
      </div>
      
      {error && <p className="text-danger">{error}</p>}
      {message && <p className="text-success">{message}</p>}
      
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <tr key={author.email}>
                  <td>
                    <img
                      src={author.profileImageUrl}
                      alt={author.firstName}
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                  </td>
                  <td>{author.firstName} {author.lastName}</td>
                  <td>{author.email}</td>
                  <td>
                    <span className={author.isActive ? 'text-success' : 'text-danger'}>
                      {author.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td>
                    {author.isActive ? (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => updateAuthorStatus(author.email, false)}
                      >
                        <MdBlock className="me-1" />
                        Block
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateAuthorStatus(author.email, true)}
                      >
                        <MdCheckCircle className="me-1" />
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No {statusFilter === 'active' ? 'active' : 'blocked'} authors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Authors;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdBlock, MdCheckCircle } from 'react-icons/md';
import { useAuth, useUser } from '@clerk/clerk-react';

function Users() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // Default to show active users
  const { getToken } = useAuth();
  const { user } = useUser(); // To get current admin email

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `https://blog-v9w3.onrender.com/admin-api/users?email=${user.primaryEmailAddress.emailAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.payload) {
        setUsers(res.data.payload);
      } else {
        setErr(res.data.message || 'Failed to load users');
      }
    } catch (error) {
      setErr('Failed to fetch users');
    }
  };

  const updateUserStatus = async (email, isActive) => {
    try {
      const token = await getToken();
      await axios.put(
        `https://blog-v9w3.onrender.com/admin-api/update-status/${email}`,
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
      setMessage(`User ${email} ${isActive ? 'unblocked' : 'blocked'} successfully`);

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.email === email ? { ...u, isActive } : u
        )
      );
    } catch (error) {
      setErr(`Failed to ${isActive ? 'unblock' : 'block'} user`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Filter users based on status
  const filteredUsers = users.filter(userData => 
    (statusFilter === 'active' && userData.isActive) || 
    (statusFilter === 'blocked' && !userData.isActive)
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Users</h2>
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
      
      {err && <p className="text-danger">{err}</p>}
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((userData) => (
                <tr key={userData.email}>
                  <td>
                    <img
                      src={userData.profileImageUrl || 'https://via.placeholder.com/40'}
                      alt={userData.firstName}
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                  </td>
                  <td>{userData.firstName} {userData.lastName}</td>
                  <td>{userData.email}</td>
                  <td>
                    <span className={userData.isActive ? 'text-success' : 'text-danger'}>
                      {userData.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td>
                    {userData.isActive ? (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => updateUserStatus(userData.email, false)}
                      >
                        <MdBlock className="me-1" />
                        Block
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateUserStatus(userData.email, true)}
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
                  No {statusFilter === 'active' ? 'active' : 'blocked'} users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
import { createContext, useState, useEffect } from 'react';

export const userAuthorContextObj = createContext();

 
function UserAuthorContext({ children }) {
  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    role: ""
  });

  useEffect(() => {
    const userInStorage = localStorage.getItem('currentUser');
    if (userInStorage) {
      try {
        setCurrentUser(JSON.parse(userInStorage));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  return (
    <userAuthorContextObj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </userAuthorContextObj.Provider>
  );
}

export default UserAuthorContext;

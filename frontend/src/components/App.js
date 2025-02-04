import React, { useState } from 'react';
import Signup from 'E:\\interview-preparaton-platform\\frontend\\src\\components\\signup.js';
import Login from 'E:\\interview-preparaton-platform\\frontend\\src\\components\\login.js';
import Interview from 'E:\\interview-preparaton-platform\\frontend\\src\\components\\interview.js';

const App = () => {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <h1>Interview Preparation Platform</h1>
      {!isLoggedIn ? (
        <div>
          <Signup />
          <Login setToken={setToken} />
        </div>
      ) : (
        <Interview token={token} />
      )}
    </div>
  );
};

export default App;

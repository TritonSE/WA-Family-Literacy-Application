import React from 'react';

import './LoginPage.css';

export const LoginPage: React.FC = () => {
  return (
    <div className="loginContainer">
      <img className="loginLogo" src="./img/logo.png" alt="Logo" />
      <form className="loginForm">
        <input className="body3 loginInput" required placeholder="Username" type="text"></input>
        <input className="body3 loginInput" required placeholder="Password" type="password"></input>
        <button className="body3 loginBtn" type="submit">Login</button>
      </form>
    </div>
  );
};

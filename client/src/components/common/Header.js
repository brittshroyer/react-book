import React from 'react';
import { Link } from 'react-router-dom';
import Search from  './Search';
import './Header.css';

const Header = () => {
  return (
    <div className="Header">
      <Link to="/">
        <i className="fa fa-users fa-2x"></i>
      </Link>
      <Search />
      <Link to="/create">
        <button className="btn btn-primary"><i className="fa fa-plus"></i> &nbsp;Create Profile</button>
      </Link>
    </div>
  );
}

export default Header;

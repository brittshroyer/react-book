import React from 'react';
import { Redirect } from 'react-router-dom';

const Login = (props) => {

  // const login = () => {
  //   this.props.auth.login();
  // }

  const { isAuthenticated } = this.props.auth;

  return (
    <div>
      {
        isAuthenticated() ? (
          <Redirect to={{pathname:'/'}} />
        ) : (
          <div className='text-center w-100 mt-5'>
            <h4>You are logged out</h4>
            <button className="btn btn-primary" onClick={() => this.login()}>Log In</button>
          </div>
        )
      }
    </div>
  )


}


export default Login;

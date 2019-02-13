import auth0 from 'auth0-js';
import history from '../history';
import { AUTH_CLIENT_ID } from '../config';

export default class Auth {

  auth0 = new auth0.WebAuth({
    domain: 'brittshroyer.auth0.com',
    clientID: AUTH_CLIENT_ID,
    // redirectUri: 'https://rocky-cliffs-93491.herokuapp.com/loading',
    redirectUri: 'http://localhost:3000/loading',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  login() {
    this.auth0.authorize();
  }

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if (err) {
        history.replace('/logout');
        console.log(err);
      }
    });
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.log('no token');
      // throw new Error('No Access Token found');
      return this.logout();
    }
    return accessToken;
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    if (!accessToken) {
      return history.replace('/login');
    }
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace('/');
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}

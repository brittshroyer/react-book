import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from './services/Auth';
import Header from './components/common/Header';
import List from './components/list/List';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Detail from './components/detail/Detail';
import Create from './components/Create';

import './index.css';

const auth = new Auth();

// const handleAuthentication = ({location}) => {
//   if (/access_token|id_token|error/.test(location.hash)) {
//     auth.handleAuthentication();
//   }
// };

const logout = () => {
  auth.logout();
}

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route path="/" render={(props) => <List {...props} auth={auth} />} exact />
          <Route path="/create" render={(props) => <Create {...props} auth={auth} />} exact />
          <Route path="/user/:username" render={(props) => <Detail {...props} auth={auth} />} exact />
          <Route path="/logout" exact render={(props) => {
            logout();
            return <Login {...props} auth={auth} />
          }}/>
          <Route path="/login" render={(props) => <Login {...props} auth={auth} />} exact />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

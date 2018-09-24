import React, { Component } from 'react';
import { Route} from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Register } from './components/_register/RegisterPage';
import { Login } from './components/_login/LoginPage';
import { ConnectStrava } from './components/_register/connectStrava';
import { SubmitUserInfo } from './components/_register/SubmitUserInfo';
import { UserHome } from './components/_user/UserHome';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';


export default class App extends Component {
    displayName = App.name
    
  render() {
    return (
        <Layout>
            <Route path="/authorize-strava" component={() => window.location ="http://www.strava.com/oauth/authorize?client_id=28837&response_type=code&redirect_uri=https://localhost:44355/users/&approval_prompt=force&scope=view_private" }/>
            <Route exact path='/' component={Home} />
            <Route path='/users' component={UserHome}/>
        <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/submitUserInfo' component={SubmitUserInfo} />
            <Route path='/connect' component={ConnectStrava} />
      </Layout>
    );
  }
}

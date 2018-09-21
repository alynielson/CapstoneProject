import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Register } from './components/_register/RegisterPage';
import { Login } from './components/_login/LoginPage';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';


export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
      </Layout>
    );
  }
}

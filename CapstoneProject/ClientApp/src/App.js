import React, { Component } from 'react';
import { Route, Switch} from 'react-router';
import { Layout } from './components/Layout';


import { Home } from './components/Home';
import { Register } from './components/_register/RegisterPage';
import { Login } from './components/_login/LoginPage';
import { ConnectStrava } from './components/_register/connectStrava';
import { SubmitUserInfo } from './components/_register/SubmitUserInfo';
import { UserHome } from './components/_user/UserHome';
import { Logout } from './components/_login/Logout';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import { Blank } from './components/Blank';
import { UserRouteContent } from './components/_user/UserRouteContent';
import { UserEventContent } from './components/_user/UserEventContent';
import { UserGroupContent } from './components/_user/UserGroupContent';


export default class App extends Component {
    //displayName = App.name
    constructor(props) {
        super(props);
        this.state = {
            tryLogout: false,
            isLoggingIn: false,
            isLoggedIn: false,
            isRegistering: false
        }
        this.tryLogout = this.tryLogout.bind(this);
        this.onCancelLogout = this.onCancelLogout.bind(this);
        this.onClickingRegister = this.onClickingRegister.bind(this);
        this.onLoggingIn = this.onLoggingIn.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('userId')) {
            this.setState({

                isLoggedIn: true,
               
            })
        }
        else {
            this.setState({
                isLoggedIn: false
            })
        }
    }
    tryLogout() {
        this.setState({
            tryLogout: true
            
        });
    }
    onCancelLogout() {
        this.setState({ tryLogout: false });
    }
    doLogout() {
        this.setState({
            tryLogout: false,
            isLoggedIn: false,
        });
    }
    onClickingLogin() {
        this.setState({
            tryLogout: false,
            isLoggingIn: true,
            isRegistering: false
        });
    }
    onLoggingIn() {
        this.setState({
            isLoggedIn: true,
            isLoggingIn: false,
            isRegistering: false
        })
    }
    onClickingRegister() {
        this.setState({
            isRegistering: true,
            isLoggingIn: false
        })
    }

    render() {
        const doLogout = (() => this.doLogout());
        const cancelLogout = (() => this.onCancelLogout());
        const onClickingLogout = (() => this.tryLogout());
        const doLogin = (() => this.onClickingLogin());
        const loggedIn = (() => this.onLoggingIn());
        const onClickingRegister = (() => this.onClickingRegister());
        var logout = null;
        
            if (this.state.tryLogout === true) {
                logout = <Logout cancel={cancelLogout} clickLogOut={doLogout}/>
            }
        
        var login = null;
        if (this.state.isLoggingIn === true) {
            login = <Login loggedIn={loggedIn}/>
        }
        var homePage = null;
        if (!this.state.isLoggedIn && !this.state.isLoggingIn && !this.state.tryLogout && !this.state.isRegistering) {
            homePage = <Home />
        }
        var register = null;
        if (this.state.isRegistering) {
            register = <Register loggedIn={loggedIn} loggedIn={loggedIn}/>
        }
        return (
            <Layout tryLogout={onClickingLogout} isLoggedIn={this.state.isLoggedIn} onClickingLogin={doLogin} onClickingRegister={onClickingRegister}>
                {logout}
                {login}
                {homePage}
                {register}
                <Switch>
                <Route exact path='/home' component={Blank} />
                <Route path="/authorize-strava" component={() => window.location = "http://www.strava.com/oauth/authorize?client_id=28837&response_type=code&redirect_uri=https://localhost:44355/users/&approval_prompt=force&scope=view_private"} />
                    <Route exact path='/users' component={UserHome} />
                    <Route exact path='/groups' component={UserGroupContent} />
                    <Route exact path='/routes' component={UserRouteContent} />
                    <Route exact path='/events' component={UserEventContent} />
                </Switch>
                </Layout>
               
            );
        }
      
    
  
}

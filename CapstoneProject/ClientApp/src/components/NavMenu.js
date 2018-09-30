import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './MainStyles.css';

export class NavMenu extends Component {
    displayName = NavMenu.name
    
   
    

    render() {
        if (!this.props.isLoggedIn) {
            return (
                <Navbar fixedTop fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to={'/home'}>CapstoneProject</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                           
                                <NavItem onClick={this.props.onClickingLogin}>
                                   Login
                                </NavItem>
                           
                           
                            <NavItem onClick={this.props.onClickingRegister}>
                                    Register
                                </NavItem>
                           
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            );
        }
        else {
            return (
                <Navbar fixedTop fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            CapstoneProject
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                           
                                <NavItem>
                                     Home
                                </NavItem>
                           
                       
                            <NavItem onClick={this.props.tryLogout} >
                                Log out
                                </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                
            );
        }
    }
       

  
}

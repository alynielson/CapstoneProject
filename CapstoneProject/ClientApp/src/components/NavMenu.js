import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './MainStyles.css';

export class NavMenu extends Component {
    displayName = NavMenu.name
    
   
    

    render() {
        if (!localStorage.getItem('userId')) {
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
                            <LinkContainer to={'/login'}>
                                <NavItem>
                                   Login
                                </NavItem>
                            </LinkContainer>
                            <LinkContainer to={'/register'}>
                                <NavItem>
                                    Register
                                </NavItem>
                            </LinkContainer>
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
                            <Link to={'/home'}>CapstoneProject</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <LinkContainer to={'/users'}> 
                                <NavItem>
                                     Home
                                </NavItem>
                            </LinkContainer>
                       
                            <LinkContainer to={'/logout'}>
                                <NavItem>
                                     Log out
                                </NavItem>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                
            );
        }
    }
       

  
}

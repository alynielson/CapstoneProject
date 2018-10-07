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
                            <Link to={'/home'} >NAME</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                           
                            <NavItem onClick={this.props.onClickingLogin}>
                                   LOG IN
                                </NavItem>
                           
                           
                            <NavItem onClick={this.props.onClickingRegister} >
                                    SIGN UP
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
                        <Navbar.Brand >
                            NAME
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <LinkContainer to='/users'>
                                <NavItem >
                                     HOME
                                </NavItem>
                            </LinkContainer>
                            <LinkContainer to='/groups'>
                                <NavItem >
                                GROUPS
                                </NavItem>
                            </LinkContainer>
                            <LinkContainer to='/routes'>
                                <NavItem >
                               ROUTES
                                </NavItem>
                            </LinkContainer>
                            <LinkContainer to='/events'>
                                <NavItem >
                                EVENTS
                                </NavItem>
                                </LinkContainer>
                        </Nav>   
                       <Nav pullRight>
                            <NavItem onClick={this.props.tryLogout} >
                                LOG OUT
                                </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                
            );
        }
    }
       

  
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem, Button } from 'react-bootstrap';
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
                            <div className="brand" onClick={this.props.onClickingTab}>ONWARD</div>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        
                        <Nav pullRight>
                            <NavItem>
                            <div className="corner-nav-buttons" onClick={this.props.onClickingLogin}>
                                   LOG IN 
                                </div>
                               </NavItem>
                            <NavItem onClick={this.props.onClickingRegister} >
                                <div className="corner-nav-buttons">
                                    SIGN UP </div>
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
                            ONWARD
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <LinkContainer to='/users'>
                                <NavItem>
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
                                <div className="corner-nav-buttons">LOG OUT</div>
                                </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                
            );
        }
    }
       

  
}

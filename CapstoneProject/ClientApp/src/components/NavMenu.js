import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Glyphicon, Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  render() {
    return (
      <Navbar inverse fixedTop fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={'/'}>CapstoneProject</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to={'/submitUserInfo'} exact>
              <NavItem>
                <Glyphicon glyph='home' /> Submit User Info
              </NavItem>
            </LinkContainer>
            <LinkContainer to={'/register'}>
              <NavItem>
                <Glyphicon glyph='education' /> Register
              </NavItem>
            </LinkContainer>
            <LinkContainer to={'/login'}>
              <NavItem>
                <Glyphicon glyph='th-list' /> Login
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

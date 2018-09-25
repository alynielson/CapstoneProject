import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  //displayName = Layout.name
    constructor(props) {
        super(props);


       
    }

    isUserLoggedIn() {
        if (!localStorage.getItem("userId")) {
            return false;
        }
        else { return true;}
    }
    

  render() {
    return (
      <Grid fluid>
        
          
                    <NavMenu isLoggedIn={this.isUserLoggedIn()}/>
          
          <div className="body-content">
            {this.props.children}
         
        </div>
      </Grid>
    );
  }
}

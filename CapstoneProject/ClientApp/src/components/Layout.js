import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  //displayName = Layout.name
    constructor(props) {
        super(props);


       
    }

  
    
    

  render() {
    return (
      <Grid fluid>
        
          
            <NavMenu tryLogout={this.props.tryLogout} onClickingRegister={this.props.onClickingRegister} isLoggedIn={this.props.isLoggedIn} onClickingLogin={this.props.onClickingLogin}/>
          
          <div className="body-content">
            {this.props.children}
         
        </div>
      </Grid>
    );
  }
}

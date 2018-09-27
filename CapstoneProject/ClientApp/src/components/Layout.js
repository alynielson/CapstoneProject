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
        
          
            <NavMenu />
          
          <div className="body-content">
            {this.props.children}
         
        </div>
      </Grid>
    );
  }
}

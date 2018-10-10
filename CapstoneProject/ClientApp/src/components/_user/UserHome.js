import React, { Component } from 'react';
import { Button, ButtonGroup, Nav,NavItem, FormControl, ControlLabel, Col, ColProps, Row, Alert } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';

import { UserHomeContent } from './UserHomeContent';

import '../MainStyles.css'


export class UserHome extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
           
           
           
        }
        
    }



   

    



    render() {
        return (
            <UserHomeContent />
        );
        
    }
}
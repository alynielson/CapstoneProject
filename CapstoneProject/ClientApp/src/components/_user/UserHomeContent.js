import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, ColProps, Row, ButtonToolbar } from 'react-bootstrap';
import { Route, Link, Redirect, withRouter, BrowserRouter } from 'react-router-dom';
import background from './images/background.jpg'


export class UserHomeContent extends Component {
    constructor(props) {
        super(props);

    }




    render() {
        return (
            
            <img className="background-img" src={background} />
            
            
            );
    }



}